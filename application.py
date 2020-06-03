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
    chatRoomId = data["chat-room-id"]
    time = datetime.now()
    time_str = time.strftime("%d %m %Y %H:%M:%S")

    #if chatRoomId not in messages.keys():
        #messages[chatRoomId] = []
    messages[chatRoomId].append((time_str, message))

    messageId = len(messages[chatRoomId])


    # replace latter by cht room id
    #messages['About'] = message
    #messages[chatRoomId] = {str(count): message}
    #count += 1
    #emit("latest 100 messages", messages, chatRoomId, broadcast=True)
    #emit("latest messages", {"message": message, "chatroomid": chatRoomId}, broadcast=True)
    emit("latest messages", {"message": message, "chatRoomId": chatRoomId, "messageId": messageId, "time": time_str}, broadcast=True)


@socketio.on("chat room request")
def getChatRoom(data):
    chatRoomName = data["chatRoomName"]
    chatRoomMessages = messages[chatRoomName]
    emit("chat room access", {"chatRoomName": chatRoomName, "messages": chatRoomMessages})



@socketio.on("create new chat room")
def createChatRoom(data):
    chatRoomName = data["chatRoomName"]
    chatRooms.append(chatRoomName)
    messages[chatRoomName] = []
    emit("new chat room created", {"chatRoomName": chatRoomName}, broadcast=True)
