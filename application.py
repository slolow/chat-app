import os
import requests

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

buttonTexts = {'name_page': 'let\'s chat',
               'new_chat_page': 'create'}


@app.route("/")
def index():
    return render_template("index.html")

# find out how to combinate /name and /new-chat to one route
@app.route("/name")
def prompt_name():
    return render_template("form.html", title=title['name_page'], h1=h1['name_page'], buttonText=buttonTexts['name_page'])


@app.route("/new-chat")
def prompt_new_chat():
    return render_template("form.html", title=title['new_chat_page'], h1=h1['new_chat_page'], buttonText=buttonTexts['new_chat_page'])
