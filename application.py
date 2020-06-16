import os
import requests

# for tests delete later on
import random

from datetime import datetime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

title = {'name_page': 'name',
         'new_chat_page': 'create  new chat'}

h1 = {'name_page': 'Welcome Amigo! Please, tell me your name.',
          'new_chat_page': 'Create a new chat my friend!'}

button_texts = {'name_page': 'let\'s chat',
               'new_chat_page': 'create'}

# better create chat_rooms dict like this: chat_rooms = {'football': [message1, message2, ....], 'karate': [message1, ...], ...} see old version of app!
chat_rooms = []


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        new_chat = request.form.get(button_texts['new_chat_page'])
        chat_rooms.append(new_chat)
        chat_rooms.sort()
        #print(f'Append {new_chat} to {chat_rooms}')
    return render_template("index.html")

# find out how to combinate /name and /new-chat to one route
@app.route("/name")
def prompt_name():
    return render_template("form.html", title=title['name_page'], h1=h1['name_page'], buttonText=button_texts['name_page'])


@app.route("/new-chat")
def prompt_new_chat():
    return render_template("form.html", title=title['new_chat_page'], h1=h1['new_chat_page'], buttonText=button_texts['new_chat_page'])


@app.route("/chats", methods=["POST"])
def chats():

    # Get start and end point for chats to generate.
    start = int(request.form.get("start") or 0)
    end = int(request.form.get("end") or (start + 9))

    # Generate list of chats. Change later on by real chatnames
    data = []
    for i in range(start, end + 1):
        data.append(f"chat #{i}")

    # Return list of chats.
    return jsonify(data)

@app.route("/messages", methods=["POST"])
def messages():

    # Get start and end point for messages to generate.
    start = int(request.form.get("start") or 0)
    end = int(request.form.get("end") or (start + 9))

    # for tests delete later on
    user = ['ju', 'Harry']

    # Generate list of messages. Change later on by real message
    data = []
    for i in range(start, end + 1):
        data.append({'message': f"message #{i}", 'user': user[random.randint(0, 1)], 'time': '06.09.2020 at 12:45Am'})
        print(user[random.randint(0, 1)])
        #data.append(f"message #{i}")

    # Return list of chats.
    return jsonify(data)
