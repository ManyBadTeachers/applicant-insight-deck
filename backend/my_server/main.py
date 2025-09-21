from config import app
from flask import request, jsonify
from database import create_connection
import requests
import sqlite3

from openai import OpenAI
from pydantic import BaseModel
from pprint import pprint



from functions import news_scraper, get_next_monday
from datetime import datetime



# ANSI color codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

# open_ai key
my_secret_key = "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"

@app.route("/")
def test():
   return jsonify({"message": "test"})

@app.route("/news_preferences", methods=["POST"])
def news_preferences():
   data = request.get_json()

   username = data.get("username")
   news_topic = data.get("news_topic")
   choice = data.get("choice")

   if username is None or news_topic is None or choice is None:
      return jsonify({"message": "Error: not enough data given"}), 400

   print(f"receieved data {username} {news_topic} {choice}")

   conn = create_connection()
   cur = conn.cursor()

   sql = "SELECT Id FROM Users WHERE Username = ?"
   response = cur.execute(sql, (username,))
   user_id = response.fetchone()[0]

   sql = "SELECT COUNT(*) FROM News_preferences WHERE Owner_id = ? AND Topic = ?"
   cur.execute(sql, (user_id, news_topic))
   count = cur.fetchone()[0]

   if count > 0:
      # Update existing preference
      sql = "UPDATE News_preferences SET Preferred = ? WHERE Owner_id = ? AND Topic = ?"
      cur.execute(sql, (choice, user_id, news_topic))
   else:
      # Insert new preference
      sql = "INSERT INTO News_preferences (Owner_id, Topic, Preferred) VALUES (?, ?, ?)"
      cur.execute(sql, (user_id, news_topic, choice))

   conn.commit()
   conn.close()

   return jsonify({"message": "Successfully updated news preference"}), 200

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    password = data.get("password")
    username = data.get("username")

    if not password or not username:
        return jsonify({"message": "Error: Username and password are required."}), 400

    conn = create_connection()
    cur = conn.cursor()

    # Check if username already exists
    cur.execute("SELECT 1 FROM Users WHERE Username = ?", (username,))
    if cur.fetchone() is not None:
        conn.close()
        return jsonify({"message": "Error: Username already exists."}), 409

    try:
        sql = "INSERT INTO Users (Username, Password) VALUES (?, ?)"
        cur.execute(sql, (username, password))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        conn.close()
        return jsonify({"message": f"Database error: {e}"}), 500

    conn.close()
    return jsonify({"message": "User registered successfully."}), 201

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        conn = create_connection()
        cur = conn.cursor()
        sql = "SELECT username FROM Users WHERE username = ? AND password = ?"
        cur.execute(sql, (username, password))
        result = cur.fetchone()

        conn.close()

        if result:
            return jsonify({"message": "Successfully logged in", "username": result[0]}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"error": "An error occurred"}), 500
    
def getIdFromUsername(username):

   conn = create_connection()
   cur = conn.cursor()
   sql = "SELECT Id FROM Users WHERE username = ?"
   result = cur.execute(sql, (username, ))
   if result:
       return result.fetchone()[0]
       
   return result.fetchone()

@app.route("/get_news_preferences", methods=["POST"])
def get_news_preferences():
   data = request.get_json()
   username = data.get("username")

   if not username:
      return jsonify({"error": "Could not get Username"}), 400

   user_id = getIdFromUsername(username)

   # select users news_preferences
   conn = create_connection()
   cur = conn.cursor()
   sql = "SELECT Topic, Preferred FROM News_preferences WHERE Owner_id = ? and Preferred = ?"
   cur.execute(sql, (user_id, 1))
   response = cur.fetchall()
   return({"message": "Successfully receieved news preferences",
                   "data": response})

@app.route("/get_news_report", methods=["POST"])
def get_news_report():

    # get user_id
    data = request.get_json()
    username = data.get("username")
    user_id = getIdFromUsername(username)

    # get current date
    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")

    final_list = []  # what we're sending to frontend!

    # create connection to db
    conn = create_connection()
    cur = conn.cursor()

    # Check if any articles exist today for this user
    sql = "SELECT * FROM News_article WHERE Owner_id = ? and Creation_date = ?"
    cur.execute(sql, (user_id, current_date))
    articles_db = cur.fetchall()

    if articles_db:  # if news report for today exists, load it
        print(f"\n{BOLD}{CYAN}A News report already exists for user, loading it now ------ {RESET}")

        # Fetch the actual article data
        sql = "SELECT Id, Title, Timestamp, Href, Img_url, Creation_date FROM News_article WHERE Owner_id = ? AND Creation_date = ?"
        cur.execute(sql, (user_id, current_date))
        articles = cur.fetchall()

        # Loop through and build final list
        for article in articles:
            temp_dict = {
                "id": article[0],
                "title": article[1],
                "timestamp": article[2],
                "url": article[3],
                "image_url": article[4]
            }
            final_list.append(temp_dict)

        return jsonify({
            "message": "Successfully loaded saved articles from DB",
            "data": final_list
        }), 200

    
    # if no news report exist, create one and load it
    else:
        print(f"\n{BOLD}{CYAN}------ 📰 Running Scraper Route: /get_news_report -------{RESET}\n")

        # Call the scraper
        print(f"{BOLD}{CYAN}>>> STEP 1: No news report exists for todays date, creating one now...{RESET}")
        entire_news_articles, minimized_articles = news_scraper()

        # get user user preferences
        conn = create_connection()
        cur = conn.cursor()
        sql = "SELECT Topic FROM News_preferences WHERE Owner_id = ? AND Preferred = ?"
        cur.execute(sql, (user_id, 1))
        response = cur.fetchall()

        # get user preferences/topics
        topics = []
        for row in response:
            topic = row[0]
            topics.append(topic[1:])
        
        client = OpenAI(api_key=my_secret_key)

        class Article(BaseModel):
            id: int
            title: str

        class ArticleList(BaseModel):
            articles: list[Article]

        response = client.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a news filter AI. The user will send you a list of news articles "
                        "and their topic preferences. Return the top 6 articles the user is most likely to be interested in. "
                        "The articles you choose most have been published today."
                    ),
                },
                {
                    "role": "user",
                    "content": f"User is interested in: {topics}. Here are the articles: {minimized_articles}. Current date is {current_date}."
                },
            ],
            response_format=ArticleList,
        )


        result = response.choices[0].message.parsed

        # 6. Print result
        print("\n✅ Receieved GPT Structured Output" , result)

        pprint(result)

        json_scheme = result.model_dump() # returns dictionary

        for full_article in entire_news_articles:
            temp_id = full_article.get("id")
            title = full_article.get("title")
            timestamp = full_article.get("timestamp")

            for article in json_scheme["articles"]:
                id = article.get("id")
                if temp_id == id:
                    # article id match, merge them
                    url = full_article.get("url")
                    image_url = full_article.get("image_url")

                    try:
                        sql = "INSERT INTO News_article (Owner_id, Title, Timestamp, Href, Img_url, Creation_date) VALUES (?, ?, ?, ?, ?, ?)"
                        cur.execute(sql, (user_id, title, timestamp, url, image_url, current_date))
                    except sqlite3.IntegrityError as e:
                        print(f"Skipped duplicate entry: {title} ({e})")
                    temp_dict = {
                        "id": id,
                        "title": title,
                        "timestamp": timestamp,
                        "url": url,
                        "image_url": image_url
                    }
                    conn.commit()
                    final_list.append(temp_dict)
                    break  # no need to keep looping once matched
                
        conn.close()

        print(f"{GREEN}✅ Route completed successfully!{RESET}\n")

        return jsonify({
            "message": "Successfully scraped and returned articles",
            "data": final_list
        }), 200

@app.route("/get_calender_status", methods=["POST"])
def get_calender_status():
    data = request.get_json()
    username = data.get("username")

    # get user_id
    user_id = getIdFromUsername(username)

    # get coming monday
    next_monday = get_next_monday()

    conn = create_connection()
    cur = conn.cursor()
    sql = "SELECT COUNT(*) FROM Tasks WHERE Owner_id = ? AND Finished_date = ?"
    cur.execute(sql, (user_id, next_monday))
    create_task = cur.fetchone()[0]
    print(f"result {create_task}")

    if create_task:
        print("calender report already exsits you are not allowed to create another one")
        return jsonify({"message": "Not allowed to add more Tasks",
                        "allowed_to_create_tasks": False,
                        "task_amount": create_task})
    
    print("Calender report allowed")
    return jsonify({"message": "Success, Allowed to add more Tasks",
                    "allowed_to_create_tasks": True,
                    "task_amount": create_task})
    

@app.route("/get_suggested_skills", methods=["POST"])
def get_suggested_skills():
 
    # get all suggested skills
    conn = create_connection()
    cur = conn.cursor()

    sql = "SELECT * FROM skills"
    cur.execute(sql)

    skills_rows = cur.fetchall()

    suggested_skills = []
    for row in skills_rows:
        suggested_skills.append({"id": row[0], "name": row[1]})

    return jsonify({
        "suggested_skills": suggested_skills,
    })

@app.route("/add_custom_skill", methods=["POST"])
def add_custom_skill():
    data = request.get_json()
    username = data.get("username")
    customTextSkill = data.get("customTextSkill")

    conn = create_connection()
    cur = conn.cursor()

    user_id = getIdFromUsername(username)

    if not user_id:
        return jsonify({"success": False, "error": "User not found"}), 404
    
    try:
        print("adding custom skill")
        sql = "INSERT INTO skills (name) VALUES (?)"
        cur.execute(sql, (customTextSkill, ))
        conn.commit()

        # get id of the newly added skill
        sql = "SELECT id FROM skills ORDER BY id DESC LIMIT 1;"
        cur.execute(sql)
        custom_skill_id = cur.fetchone()[0]
        print(f"custom skill id {custom_skill_id}")
        # add the new custom Skill to users choosen skills

        sql = "INSERT INTO user_selected_skills (owner_id, skill_id) VALUES (?, ?)"
        cur.execute(sql, (user_id, int(custom_skill_id)))
        conn.commit()

        return jsonify({"success": True})

    except Exception as e:
        print(f"Error adding custom skill: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        conn.close()


@app.route("/select_skill", methods=["POST"])
def select_skill():
    data = request.get_json()
    username = data.get("username")
    skill_id = data.get("id")

    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()
    try:
        # Check if the entry already exists
        check_sql = "SELECT 1 FROM user_selected_skills WHERE owner_id = ? AND skill_id = ?"
        cur.execute(check_sql, (user_id, skill_id))
        exists = cur.fetchone()

        if not exists:
            insert_sql = "INSERT INTO user_selected_skills (owner_id, skill_id) VALUES (?, ?)"
            cur.execute(insert_sql, (user_id, skill_id))
            conn.commit()
        else:
            print("Skill already selected.")
        
        return jsonify({"success": True})

    except Exception as e:
        print(f"Error adding skill: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        conn.close()


@app.route("/get_selected_skills", methods=["POST"])
def get_selected_skills():
    data = request.get_json()
    username = data.get("username")

    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()

    try:
        # Join user_selected_skills with skills to get only selected ones
        sql = """
            SELECT skills.id, skills.name
            FROM user_selected_skills
            JOIN skills ON user_selected_skills.skill_id = skills.id
            WHERE user_selected_skills.owner_id = ?
        """
        cur.execute(sql, (user_id,))
        selected_rows = cur.fetchall()

        selected_skills = [{"id": row[0], "name": row[1]} for row in selected_rows]
    except Exception as e:
        print(f"Error getting selected skills: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

    print(f"Sending selected skills for {username}: {selected_skills}")
    return jsonify({
        "selected_skills": selected_skills
    })


@app.route('/remove_selected_skill', methods=['POST'])
def remove_selected_skill():
    data = request.get_json()

    username = data.get("username")
    skill_id = data.get("id")

    if not username or not skill_id:
        return jsonify({"success": False, "error": "Missing username or skill_id"}), 400

    user_id = getIdFromUsername(username)
    if not user_id:
        return jsonify({"success": False, "error": "User not found"}), 404
    
    conn = create_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "DELETE FROM user_selected_skills WHERE owner_id = ? AND skill_id = ?",
            (user_id, skill_id)
        )
        conn.commit()

        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        conn.close()


@app.route('/save_task_generation_inputs', methods=['POST'])
def save_task_generation_inputs():
    data = request.get_json()

    username = data.get("username")
    detailedText = data.get("detailedText")
    taskAmount = data.get("taskAmount")

    user_id = getIdFromUsername(username)
    if not user_id:
        return jsonify({"success": False, "error": "User not found"}), 404

    conn = create_connection()
    cur = conn.cursor()

    try:
        # Check if a task_generation already exists for this user
        cur.execute("SELECT id FROM task_generations WHERE owner_id = ?", (user_id,))
        existing = cur.fetchone()

        if existing:
            cur.execute(
                "UPDATE task_generations SET detailed_text = ?, number_of_tasks = ? WHERE owner_id = ?",
                (detailedText, int(taskAmount), user_id)
            )
        else:
            cur.execute(
                "INSERT INTO task_generations (owner_id, detailed_text, number_of_tasks) VALUES (?, ?, ?)",
                (user_id, detailedText, int(taskAmount))
            )

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        conn.close()

@app.route("/task_generation_load_data", methods=["POST"])
def task_generation_load_data():
    data = request.get_json()
    username = data.get("username")

    user_id = getIdFromUsername(username)
    if not user_id:
        return jsonify({"success": False, "error": "User not found"}), 404

    conn = create_connection()
    cur = conn.cursor()

    try:
        sql = "SELECT detailed_text, number_of_tasks FROM task_generations WHERE owner_id = ?"
        cur.execute(sql, (user_id,))
        row = cur.fetchone()

        if not row:
            return jsonify({"success": False, "error": "No task generation data found"}), 404

        detailedText, taskAmount = row
        print(f"detailedText: {detailedText}")
        print(f"taskAmount: {taskAmount}")

        return jsonify({
            "success": True,
            "detailedText": detailedText,
            "taskAmount": int(taskAmount)
        })

    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        conn.close()



import time
        
@app.route("/clean_user_input", methods=["POST"])
def clean_user_input():

    # get user inputs
    data = request.get_json()
    raw_user_input = data.get("detailedText")

    client = OpenAI(api_key=my_secret_key)

    class CleanedGoal(BaseModel):
        cleaned_text: str

    response = client.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI that receives vague, informal, or unclear user goal descriptions. "
                    "Your job is to rewrite the text into a clear and structured goal statement that communicates "
                    "exactly what the user wants to achieve, without asking any questions or giving follow-up instructions. "
                    "The output should be formatted in a way that makes it easy for another AI to later generate tasks from it. "
                    "Focus on clarity, intent, and actionable goals. Never mention AI or the task generation process. "
                    "Don't include lists or sub-tasks—only summarize and rephrase the user's intent clearly and directly."
                ),
            },
            {
                "role": "user",
                "content": f"{raw_user_input}"
            },
        ],
        response_format=CleanedGoal,
    )

    cleaned = response.choices[0].message.parsed.cleaned_text

    return jsonify({
        "success": True,
        "data": cleaned
    })


@app.route("/generate_tasks", methods=["POST"])
def generate_tasks():
    data = request.get_json()

    text = data.get("text")
    task_amount = data.get("task_amount")
    main_areas = data.get("main_areas")

    username = data.get("username")
    user_id = getIdFromUsername(username)

    client = OpenAI(api_key=my_secret_key)

    class Task(BaseModel):
        owner_id: int
        title: str
        description: str
        duration: int
        difficulty: str
        category: str


    class TaskList(BaseModel):
        task: list[Task]

    client = OpenAI(api_key=my_secret_key)

    response = client.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                    "content": (
                    "You are a task planner AI for highly motivated, productive users. "
                    "You receive three things: (1) a detailed user learning goal, (2) a list of main areas to focus on, and (3) a number of tasks to generate. "
                    "Your job is to generate that exact number of challenging, one-time tasks that help the user achieve their weekly learning goal. "
                    "Each task must be standalone and not dependent on any other task. Tasks should not be step-by-step or sequential, and there should be no general or repeated advice. "
                    "Do not generate routines, habits, or ongoing tips — only individual, clearly defined tasks the user can complete once. "
                    "Assume the user is committed and will complete all tasks during the week in any order they choose. "
                    "For each task, include: a short title, a clear and actionable description, an estimated duration (in minutes), a difficulty level (easy, medium, hard, extreme), and a category matching the user's focus areas."
                    "Tasks should be specific, practical, and push the user forward without relying on any time-based structure."
                )
            },
            {
                "role": "user",
                "content": (
                    f"User goal: {text} "
                    f"Number of tasks: {task_amount} "
                    f"User interests: {main_areas} "
                    f"User ID: {user_id}"
                )
            },
        ],
        response_format=TaskList
    )

    result = response.choices[0].message.parsed

    print("\n✅ Received GPT Structured Output")
    task_dict = result.model_dump()  # Pure dictionary
    pprint(task_dict)                # Pretty print the dictionary

    return jsonify({"data": task_dict})


@app.route("/add_tasks_to_db", methods=["POST"])
def add_tasks_to_db():
    data = request.get_json()
    tasks_list = data.get("tasks")

    if not tasks_list:
        return jsonify({"success": False}), 404

    conn = create_connection()
    cur = conn.cursor()

    next_monday_date = get_next_monday()

    for task in tasks_list:
        print(task)
        try:
            sql = "INSERT INTO Tasks (Owner_id, Title, Description, Duration, Finished_date, Daily_task, Difficulty, Category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            cur.execute(sql, (task["owner_id"], task["title"], task["description"], task["duration"], next_monday_date, 0, task["difficulty"], task["category"]))
            conn.commit()
        except Exception as e:
            print(e)

    conn.close()
    return jsonify({"success": True})


@app.route("/get_tasks", methods=["POST"])
def get_tasks():
    data = request.get_json()
    username = data.get("username")

    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT Owner_id, Title, Description, Duration, Difficulty, Category FROM Tasks WHERE Owner_id = ? AND Daily_task = 1", (user_id,))
        daily_tasks_raw = cur.fetchall()
    except Exception as e:
        print("Error fetching daily tasks:", e)
        daily_tasks_raw = []

    try:
        cur.execute("SELECT Owner_id, Title, Description, Duration, Difficulty, Category FROM Tasks WHERE Owner_id = ? AND Finished IS NULL", (user_id,))
        tasks_raw = cur.fetchall()
    except Exception as e:
        print("Error fetching tasks:", e)
        tasks_raw = []

    keys = ["owner_id", "title", "description", "duration", "difficulty", "category"]
    daily_tasks = [dict(zip(keys, row)) for row in daily_tasks_raw]
    tasks = [dict(zip(keys, row)) for row in tasks_raw]

    return jsonify({
        "daily_tasks": daily_tasks,
        "tasks": tasks
    })


@app.route("/finish_task", methods=["POST"])
def finish_task():
    data = request.get_json()

    username = data.get("username")
    task_title = data.get("task_title")

    print(f"task title {task_title}\n username {username}")

    if not username or not task_title:
        return jsonify({"success": False}), 404
    
    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()

    sql = "UPDATE Tasks SET Finished = ? WHERE Owner_id = ? AND Title = ?"
    cur.execute(sql, (1, user_id, task_title))

    conn.commit()
    
    try:
        cur.execute("SELECT Owner_id, Title, Description, Duration, Difficulty, Category FROM Tasks WHERE Owner_id = ? AND Finished IS NULL", (user_id,))
        tasks_raw = cur.fetchall()
    except Exception as e:
        print("Error fetching tasks:", e)
        tasks_raw = []

    keys = ["owner_id", "title", "description", "duration", "difficulty", "category"]
    tasks = [dict(zip(keys, row)) for row in tasks_raw]

    conn.close()
    return jsonify({"success": True,
                    "tasks": tasks})


@app.route("/add_daily_task", methods=["POST"])
def add_daily_task():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    duration = data.get("duration")
    category = data.get("category")
    difficulty = data.get("difficulty")

    username = data.get("username")
    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()
    
    try:
        sql = "INSERT INTO Tasks (Owner_id, Title, Description, Duration, Daily_task, Difficulty, Category) VALUES (?, ?, ?, ?, ?, ?, ?)"
        cur.execute(sql, (user_id, title, description, duration, 1, difficulty, category))
        conn.commit()

    except Exception as e:
        print(e)

    try:
        cur.execute("SELECT Owner_id, Title, Description, Duration, Difficulty, Category FROM Tasks WHERE Owner_id = ? AND Daily_task = 1", (user_id,))
        daily_tasks_raw = cur.fetchall()
    except Exception as e:
        print("Error fetching daily tasks:", e)
        daily_tasks_raw = []

    keys = ["owner_id", "title", "description", "duration", "difficulty", "category"]
    daily_tasks = [dict(zip(keys, row)) for row in daily_tasks_raw]

    conn.close()

    return jsonify({"success": True,
                    "daily_tasks": daily_tasks })

@app.route("/remove_daily_task", methods=["POST"])
def remove_daily_task():
    data = request.get_json()

    username = data.get("username")
    title = data.get("title")

    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()
    
    try:
        sql = "DELETE FROM Tasks WHERE Owner_id = ? AND Title = ? AND Daily_task = ?"
        cur.execute(sql, (user_id, title, 1))
        conn.commit()

    except Exception as e:
        print(e)

    try:
        cur.execute("SELECT Owner_id, Title, Description, Duration, Difficulty, Category FROM Tasks WHERE Owner_id = ? AND Daily_task = 1", (user_id,))
        daily_tasks_raw = cur.fetchall()
    except Exception as e:
        print("Error fetching daily tasks:", e)
        daily_tasks_raw = []

    keys = ["owner_id", "title", "description", "duration", "difficulty", "category"]
    daily_tasks = [dict(zip(keys, row)) for row in daily_tasks_raw]

    conn.close()
    return jsonify({"success": True,
                    "daily_tasks": daily_tasks })


@app.route("/get_fitness_sign_upp_review", methods=["POST"])
def get_fitness_sign_upp_review():
    data = request.get_json()
    username = data.get("username")

    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()

    if not user_id:
        return jsonify({"answered_fitness_questions": False}), 404
    
    fitness_review = False
    workout_schedule = False
    
    try:
        sql = "SELECT * FROM Users JOIN User_Preferences ON Users.Id = User_Preferences.OwnerId WHERE User_Preferences.FitnessSignUp = 1 AND OwnerId = ?;"
        cur.execute(sql, (user_id, ))
        response = cur.fetchone()
        if response:
            fitness_review = True

        # code that sends back workout_schedule if exists !!!!!!!!!S!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SS

        workout_schedule = False
        return jsonify({"answered_fitness_questions": fitness_review,
                        "has_workout_schedule": workout_schedule})

    except Exception as e:
        print(e)

    return jsonify({"data": False})


@app.route("/submit_fitness_questions", methods=["POST"])
def submit_fitness_questions():
    data =  request.get_json()

    age = data.get("age")
    weight = data.get("weight")
    height = data.get("height")
    gender = data.get("gender")
    experience = data.get("experience")
    gymFrequency = data.get("gymFrequency")

    username = data.get("username")
    user_id = getIdFromUsername(username)

    conn = create_connection()
    cur = conn.cursor()

    try:
        sql = "INSERT INTO Fitness_profile (owner_id, age, height, weight, gender, experience, gym_frequency) VALUES (?, ?, ?, ?, ?, ?, ?)"
        cur.execute(sql, (user_id, int(age), int(height), float(weight), gender, experience, gymFrequency))
        conn.commit()

        sql = "INSERT INTO User_Preferences (OwnerId, FitnessSignUp) VALUES (?, ?)"
        cur.execute(sql, (user_id, 1))
        conn.commit()

        conn.close()
        return jsonify({"success": True})
    
    except Exception as e:
        print(e)

    conn.close()
    return jsonify({"success": False})


@app.route("/get_welcome_message", methods=["POST"])
def get_welcome_message():
    data = request.get_json()
    username = data.get("username")

    user_id = getIdFromUsername(username)

    if not user_id:
        return jsonify({"message": "User not found."}), 404

    conn = create_connection()
    cur = conn.cursor()

    fitness_review = False
    workout_schedule = False

    try:
        # Check if the user has completed the fitness questions
        sql_fitness = "SELECT 1 FROM User_Preferences WHERE OwnerId = ? AND FitnessSignUp = 1"
        cur.execute(sql_fitness, (user_id,))
        if cur.fetchone():
            fitness_review = True

        # code that actailly checks if workout schedule exsits !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        workout_schedule = False

        if fitness_review and workout_schedule:
            message = (
                "WWelcome back! Here's your workout schedule. Have a great day!... An X in the calender means you have training that day (="
            )
        elif fitness_review and not workout_schedule:
            message = (
                "WWelcome. We have received your fitness profile. "
                "However, no workout schedule has been created yet. "
                "Please proceed to generate your workout plan to begin your program."
            )
        elif not fitness_review:
            message = (
                "WWelcome. Before a workout schedule can be created, "
                "you must complete the initial fitness questions. "
                "These details are essential to tailor your program effectively. See below to begin."
            )
        else:
            message = (
                "WWelcome. Please ensure your fitness profile is complete and a schedule is generated "
                "to proceed with your training journey."
            )

        conn.close()
        return jsonify({"message": message})

    except Exception as e:
        print(e)
        conn.close()
        return jsonify({"message": "An error occurred while retrieving the welcome message."}), 500


@app.route("/get_fitness_data", methods=["POST"])
def get_fitness_data():
    data = request.get_json()
    
    username = data.get("username")
    user_id = getIdFromUsername(username)

    if not user_id:
        return jsonify({"message": "User not found."}), 404
    
    conn = create_connection()
    cur = conn.cursor()

    try:
        sql = """
            SELECT age, weight, height, gender, experience, gym_frequency
            FROM Fitness_profile
            WHERE owner_id = ?
        """
        cur.execute(sql, (user_id,))
        row = cur.fetchone()
        
        if row:
            age = row[0]
            weight = row[1]
            height = row[2]
            gender = row[3]
            experience = row[4]
            frequency = row[5]
        else:
            age = None
            weight = None
            height = None
            gender = None
            experience = None
            frequency = None

    except Exception as e:
        print(e)

    return jsonify({
        "message": "Success",
        "age": age,
        "height": height,
        "weight": weight,
        "gender": gender,
        "experience": experience,
        "frequency": frequency
    })


@app.route("/generate_workout_schedule", methods=["POST"])
def generate_workout_schedule():
    data = request.get_json()
    age = data.get("age")
    weight = data.get("weight")
    height = data.get("height")
    gender = data.get("gender")
    experience = data.get("experience")
    frequency = data.get("frequency")
    detailed_text = data.get("detailed_text")

    username = data.get("username")
    user_id = getIdFromUsername(username)


    if not user_id:
        return jsonify({"success": False}), 404
    
    # ========== Pydantic Models ==========

    time.sleep(5)
    
    return jsonify({"success": True})


if __name__ == '__main__':
   app.run(debug=True)
              