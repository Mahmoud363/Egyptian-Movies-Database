import json
import decimal
from datetime import date

from flask import Flask, request, jsonify, abort, session, redirect, url_for
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            # wanted a simple yield str(o) in the next line,
            # but that would mean a yield on the line with super(...),
            # which wouldn't work (see my comment below), so...
            return (float(o) for o in [o])
        elif isinstance(o, date):
            return str(o.strftime("%Y-%m-%d"))
        else:
            return super(DecimalEncoder, self).default(o)


app = Flask(__name__)

app.config["MYSQL_USER"] = "freedbtech_mahmoud"
app.config["MYSQL_PASSWORD"] = "123"
app.config["MYSQL_HOST"] = "freedb.tech"
app.config["MYSQL_DB"] = "freedbtech_imdbproj"
app.config["MYSQL_CURSORCLASS"] = "DictCursor"
app.config["JSON_AS_ASCII"] = False
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)


CORS(app)

# app.json_encoder = DecimalEncoder
mysql = MySQL(app)



@app.route("/api/movies/", methods=["GET"])
def index():
    cur = mysql.connection.cursor()
    query = f"""SELECT * FROM movie ORDER BY revenue DESC LIMIT 10;"""
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["release_date"] is not None:
            row["release_date"] = str(row["release_date"].strftime("%Y-%m-%d"))
        if row["revenue"] is not None:
            row["revenue"] = float(row["revenue"])
    return jsonify(data)

@app.route("/api/movies/all/", methods=["GET"])
def movies_all():
    cur = mysql.connection.cursor()
    query = f"""SELECT * FROM movie ORDER BY revenue DESC ;"""
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["release_date"] is not None:
            row["release_date"] = str(row["release_date"].strftime("%Y-%m-%d"))
        if row["revenue"] is not None:
            row["revenue"] = float(row["revenue"])
    return jsonify(data)

@app.route("/api/movies/<pk>/", methods=["GET"])
def movie_data(pk):
    cur = mysql.connection.cursor()
    query = f"SELECT * FROM movie WHERE movieID={pk}"
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["release_date"] is not None:
            row["release_date"] = str(row["release_date"].strftime("%Y-%m-%d"))
        if row["revenue"] is not None:
            row["revenue"] = float(row["revenue"])
    return jsonify(data)

@app.route("/api/movies/<pk>/avg_rating", methods=["GET"])
def movie_rating(pk):
    cur = mysql.connection.cursor()
    query = f"SELECT AVG(rating) AS rating FROM review WHERE movieID={pk}"
    cur.execute(query)
    data = cur.fetchall()
    return jsonify(data)

@app.route("/api/cast/", methods=["GET"])
def cast_data_all():
    cur = mysql.connection.cursor()
    query = f"SELECT * FROM cast_member"
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["birthdate"] is not None:
            row["birthdate"] = str(row["birthdate"].strftime("%Y-%m-%d"))
    return jsonify(data)


@app.route("/api/cast/<pk>/", methods=["GET"])
def cast_data(pk):
    cur = mysql.connection.cursor()
    query = f"SELECT * FROM cast_member WHERE castID={pk}"
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["birthdate"] is not None:
            row["birthdate"] = str(row["birthdate"].strftime("%Y-%m-%d"))
    return jsonify(data)


@app.route("/api/genres/", methods=["GET"])
def get_genres():
    cur = mysql.connection.cursor()
    query = f"""SELECT DISTINCT(type) FROM movie_category;"""
    cur.execute(query)
    data = cur.fetchall()
    return jsonify(data)


@app.route("/api/genres/<pk>/", methods=["GET"])
def get_genre_movies(pk):
    cur = mysql.connection.cursor()
    type = '"' + str(pk) + '"'
    query = f"""SELECT m.movieID, m.name, m.revenue, m.age_rating, m.coloured, m.description, m.duration, m.language, m.release_date, m.image FROM movie m,movie_category g 
    WHERE g.type = "{pk}" AND g.movieID = m.movieID
    ORDER BY m.revenue DESC;"""
    cur.execute(query)

    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()
        if row["release_date"] is not None:
            row["release_date"] = str(row["release_date"].strftime("%Y-%m-%d"))
        if row["revenue"] is not None:
            row["revenue"] = float(row["revenue"])
    return jsonify(data)

@app.route("/api/movies/<pk>/genres", methods=["GET"])
def get_movies_genre(pk):
    cur = mysql.connection.cursor()
    type = '"' + str(pk) + '"'
    query = f"""SELECT type FROM movie_category
    WHERE movieID = {pk};"""
    cur.execute(query)

    data = cur.fetchall()
    return jsonify(data)


@app.route("/api/cast/<pk>/movies/", methods=["GET"])
def cast_movies(pk):
    cur = mysql.connection.cursor()
    query = f"""SELECT m.movieID, m.name, mc.role FROM movie m, cast_member c, movies_cast mc 
                WHERE c.castID={pk} AND mc.castID={pk} AND m.movieID=mc.movieID"""
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()

    return jsonify(data)

@app.route("/api/movies/<pk>/cast/", methods=["GET"])
def movies_cast(pk):
    cur = mysql.connection.cursor()
    query = f"""SELECT c.castID, c.name, mc.role FROM movie m, cast_member c, movies_cast mc 
                WHERE m.movieID={pk} AND mc.movieID={pk} AND c.castID=mc.castID"""
    cur.execute(query)
    data = cur.fetchall()
    for row in data:
        if row["name"] is not None:
            row["name"] = row["name"].strip()

    return jsonify(data)


@app.route("/api/register/", methods=["POST"])
def register():
    # check for a bad request
    # will probably need to be changed after doing the front to .json
    if (
        not request.json
        or not "username" in request.json
        or not "email" in request.json
        or not "password" in request.json
        or not "birthdate" in request.json
        or not "country" in request.json
        or not "gender" in request.json
    ):
        return "something missing", 400
    # retirieve the needed data from the request
    email = str(request.json["email"])
    username = str(request.json["username"])
    password = str(request.json["password"])
    birthdate = str(request.json["birthdate"])
    country = str(request.json["country"])
    gender = str(request.json["gender"])

    
    # check for dublicate username or email in the database
    cur = mysql.connection.cursor()
    check_query = f'SELECT * FROM user WHERE email="{email}" OR username = "{username}"'
    cur.execute(check_query)
    duplicates = cur.fetchall()
    if len(duplicates) != 0:
        return "dublicate username or email", 409

    # add the user info to the database
    insertion_query = f"""INSERT INTO user (username, email, password, birthdate, country, gender) 
    VALUES ("{username}", "{email}", "{password}", "{birthdate}", "{country}", "{gender}")"""
    cur.execute(insertion_query)
    mysql.connection.commit()
    return "Registered", 200


@app.route("/api/login/", methods=["POST"])
@cross_origin(supports_credentials=True)
def login_post():
    # check for a bad request
    # will probably need to be changed after doing the front to .json
    if (
        not request.json
        or not "email" in request.json
        or not "password" in request.json
    ):
        return "something missing", 400
    # retirieve the needed data from the request
    email = str(request.json["email"])
    password = str(request.json["password"])
    # check for dublicate username or email in the database
    cur = mysql.connection.cursor()
    check_query = f'SELECT email, username, birthdate, country, gender FROM user WHERE email="{email}" AND password="{password}"'
    cur.execute(check_query)
    data = cur.fetchall()
    if len(data) == 0:
        return "incorrect username or password", 409

    return 'logged in', 200


@app.route("/api/logout/", methods=["POST"])
def logout():
    # check for a bad request
    # will probably need to be changed after doing the front to .json
    return "logged out", 200


@app.route("/api/user/<pk>/", methods=["GET"])
def user_data(pk):

    # retirieve the needed data from the request

    # check for dublicate username or email in the database
    cur = mysql.connection.cursor()
    check_query = f'SELECT email, username, birthdate, country, gender FROM user WHERE email="{pk}"'
    cur.execute(check_query)
    data = cur.fetchall()
    if len(data) == 0:
        return "Error in user data", 409

    return jsonify(data)


@app.route("/api/user/<pk>/reviews/", methods=["GET"])
def user_reviews(pk):

    # retirieve the needed data from the request

    # check for dublicate username or email in the database
    cur = mysql.connection.cursor()
    check_query = f'''SELECT m.name, r.rating, text_review FROM user u, review r, movie m
    WHERE u.email="{pk}" AND u.email=r.user_email AND m.movieID=r.movieID'''
    cur.execute(check_query)
    data = cur.fetchall()


    return jsonify(data)


@app.route("/api/movies/<pk>/review/", methods=["POST"])
def user_movie_reviews(pk):

    if (
        not request.json
        or not "rating" in request.json
        or not "review" in request.json
        or not "email" in request.json
    ):
        return "something missing", 400

    rating = str(request.json["rating"])
    review = str(request.json["review"])
    email = str(request.json["email"])

    cur = mysql.connection.cursor()
    query = f"""INSERT INTO review (rating, text_review, user_email, movieID) 
    VALUES ("{rating}", "{review}", "{email}", "{pk}")"""
    cur.execute(query)

    mysql.connection.commit()

    return 'done', 200


@app.route("/api/movies/<pk>/reviews", methods=["GET"])
def movie_reviews(pk):
    cur = mysql.connection.cursor()

    query = f"""SELECT u.username, r.rating, r.text_review FROM user u, movie m,review r WHERE r.movieID = "{pk}"
                AND r.movieID = m.movieID AND u.email = r.user_email;"""
    cur.execute(query)

    data = cur.fetchall()

    return jsonify(data)
