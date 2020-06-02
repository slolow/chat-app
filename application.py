import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#messages = {}
# replace with timestamp later on
#count = 0

@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("new message")
def message(data):
    message = data["message"]
    chatRoomId = data["chat-room-id"]
    # replace latter by cht room id
    #messages['About'] = message
    #messages[chatRoomId] = {str(count): message}
    #count += 1
    #emit("latest 100 messages", messages, chatRoomId, broadcast=True)
    emit("latest messages", {"message": message, "chatroomid": chatRoomId}, broadcast=True)
