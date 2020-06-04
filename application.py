import os
import requests

from datetime import datetime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = {}
chatRooms = []


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("new message")
def message(data):
    message = data["message"]
    chatRoomName = data["chatRoomName"]
    user = data["user"]
    time = datetime.now()
    time_str = time.strftime("%d %m %Y %H:%M:%S")

    #messages[chatRoomName].append((time_str, message))
    messages[chatRoomName].append({'time': time_str, 'message': message, 'user': user})
    messageId = len(messages[chatRoomName])

    emit("latest messages", {"message": message, "chatRoomName": chatRoomName, "messageId": messageId, "time": time_str, "user": user}, broadcast=True)


@socketio.on("chat room request")
def getChatRoom(data):
    chatRoomName = data["chatRoomName"]
    chatRoomMessages = messages[chatRoomName]
    emit("chat room access", {"chatRoomName": chatRoomName, "messages": chatRoomMessages}, broadcast=False)


@socketio.on("create new chat room")
def createChatRoom(data):
    chatRoomName = data["chatRoomName"]
    user = data["user"]
    if chatRoomName not in chatRooms:
        chatRooms.append(chatRoomName)
        messages[chatRoomName] = []
        nameIsAvaible = True
    else:
        nameIsAvaible = False
    emit("new chat room created", {"chatRoomName": chatRoomName, "nameIsAvaible": nameIsAvaible, "user": user}, broadcast=True)
