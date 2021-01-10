# Project2 of CS50’s Web Programming with Python and JavaScript

**Demonstration video**
https://youtu.be/IbtaYdm6HOw

**Install without virtual environment:**

  needed:

   - python3, pip and git installed

    run app from terminal:
      commands:
     1. git clone https://github.com/slolow/chat-app.git
     2. cd chat-app
     3. pip install -r requirements.txt
     4. set SECRET_KEY=*any secret key of your choice*
     5. python wsgi.py

**Or install in pipenv:**

  needed:

   - python3, pip, pipx, pipenv, git

    run app from terminal:
      commands:
     1. git clone https://github.com/slolow/chat-app.git
     2. cd chat-app
     3. pipenv install -r requirements.txt --> Pipfile and Pipfile.lock should be created
     4. set SECRET_KEY=*any secret key of your choice*
     5. pipenv run python wsgi.py
