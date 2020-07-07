import os
import requests

from datetime import datetime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

def get_time():
    time = datetime.now()
    time_str = time.strftime("%d.%m.%Y %H:%M:%S")
    return time_str

title = {'name_page': 'name',
         'new_chat_page': 'create  new chat'}

h1 = {'name_page': 'Welcome Amigo! Please, tell me your name.',
          'new_chat_page': 'Create a new chat my friend!'}

button_texts = {'name_page': 'let\'s chat',
               'new_chat_page': 'create'}

info_message = 'Important!\n Do not write inside this chat!\n\n Get started:\n 1. Create a chat by using the \"Create New Chat\" button (bottom right of page)\n 2. Fill out the form\n 3. Enjoy!'

messages_dict = {}
messages_dict['Info-Chat'] = []
messages_dict['Info-Chat'].append({'time': get_time(), 'message': info_message, 'user': 'Master user'})


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/name")
def prompt_name():
    return render_template("form.html", title=title['name_page'], h1=h1['name_page'], buttonText=button_texts['name_page'])


@app.route("/create-new-chat")
def prompt_new_chat():
    return render_template("form.html", title=title['new_chat_page'], h1=h1['new_chat_page'], buttonText=button_texts['new_chat_page'])


@app.route("/draw")
def draw():
    return render_template("draw.html")


@app.route("/chats", methods=["POST"])
def chats():
    data = list(messages_dict.keys())

    # Return list of chats.
    return jsonify(data)


@app.route("/is_chat_name_available", methods=["POST"])
def is_chat_name_available():
    chat_room = request.form.get("chat_name")

    if chat_room in messages_dict.keys():
        response = False
    else:
        messages_dict[chat_room] = []
        response = True

    return jsonify(response)


@app.route("/messages", methods=["POST"])
def messages():
    chat_room = request.form.get("chat_room")
    data = messages_dict[chat_room]
    return jsonify(data)


@socketio.on("create new chat")
def create_new_chat(data):
    new_chat = data['new_chat']
    messages_dict[new_chat] = []
    emit("new chat created", {'new_chat': new_chat} , broadcast=True)


@socketio.on("send new message")
def new_message(data):
    message = data["message"]
    chat_room = data["chat_room"]
    user = data["user"]
    time = get_time()

    messages_dict[chat_room].append({'time': time, 'message': message, 'user': user})
    message_id = len(messages_dict[chat_room])

    # only store 100 newest messages per chat room
    if message_id > 100:
        messages[chatRoomName].remove(messages[chatRoomName][0])

    emit("broadcast new message", {"message": message, "time": time, "user": user, "chat_room": chat_room}, broadcast=True)


@socketio.on("send drawing")
def new_drawing(data):
    lines = data["lines"]
    colors = data["colors"]
    cx = data["cx"]
    cy = data["cy"]
    r = data["r"]
    chat_room = data["chat_room"]
    user = data["user"]

    messages_dict[chat_room].append({'user': user, 'cx': cx, 'cy': cy, 'r': r, 'lines': lines, 'colors': colors})

    emit("broadcast new drawing", {"chat_room": chat_room, "user": user, "cx": cx, "cy": cy, "r": r, "lines": lines, "colors": colors}, broadcast=True)
