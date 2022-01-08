import json
import string
import random

from flask import Flask, render_template, request, redirect, url_for, abort
from flask_sqlalchemy import SQLAlchemy


def get_random_string(k: int = 64):
    return ''.join(random.choices([*string.ascii_letters, *string.digits], k=k))


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///beers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
# HOST = 'http://152.69.165.54'
HOST = 'http://localhost:5000'
BEERS = {
    'bottles': [20, 15, 25, 15, 20],
    'stickers': [15, 20, 20, 10, 15, 15, 20, 20, 15, 30, 10, 500],
    'tastes': [
        [15, 'Жигуновское'],
        [20, 'Бантика'],
        [15, '3 медведям'],
        [25, 'Лозел'],
        [30, 'Heinekent'],
        [30, 'Genius'],
        [15, 'Неохота']
    ]
}


class Sessions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session = db.Column(db.String(64), nullable=False)
    submitted = db.Column(db.Boolean, default=False)
    track = db.Column(db.String(16), nullable=True)


class Beer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session = db.Column(db.Integer, nullable=False)
    count = db.Column(db.Integer, nullable=False)
    bottle = db.Column(db.Integer, nullable=False)
    sticker = db.Column(db.Integer, nullable=False)
    taste = db.Column(db.Integer, nullable=False)


db.create_all()


# @app.route('/')
# def index() -> str:
#     return render_template('index.html')


@app.route('/creator')
def creator():
    session = Sessions(session=get_random_string(64))
    db.session.add(session)
    db.session.commit()
    return render_template('creator.html', data=BEERS, session=session.session, host=HOST)


@app.route('/submit-order', methods=['POST'])
def submit_order():
    try:
        data = json.loads(request.data)
        session = data['session']
        records = Sessions.query.filter(Sessions.session == session).all()
        if len(records) == 1 and not records[0].submitted:
            records[0].submitted = True
            for beer in data['beers'][: 10]:
                db.session.add(Beer(session=session,
                                    count=beer['count'],
                                    bottle=beer['bottle'],
                                    sticker=beer['sticker'],
                                    taste=beer['taste']))
            db.session.commit()
            return redirect(url_for('scum', session=session))
        else:
            raise Exception
    except Exception as e:
        print(e)
        return 'bad request', 400


@app.route('/scum')
def scum():
    if 'session' in request.args:
        session = request.args['session']
        records = Beer.query.filter(Beer.session == session).all()
        if records:
            data = list()
            sum_ = 0
            for record in records:
                price = record.count * (
                    BEERS['bottles'][record.bottle] +
                    (BEERS['stickers'][record.sticker] if record.sticker >= 0 else 0) +
                    BEERS['tastes'][record.taste][0]
                )
                sum_ += price
                data.append({
                    'price': price,
                    'count': record.count,
                    'bottle': record.bottle,
                    'sticker': record.sticker,
                    'taste': BEERS['tastes'][record.taste][1]
                })
            return render_template('scum.html', data=data, sum=sum_, session=session)
    abort(404)


@app.route('/submit-payment', methods=['POST'])
def submit_payment():
    try:
        data = json.loads(request.data)
        session = data['session']
        records = Sessions.query.filter(Sessions.session == session).all()
        # ДЛЯ СТАТИСТИКИ
        with open('scum.txt', 'a') as file:
            file.write(f'{data}\n')
        #
        if len(records) == 1 and records[0].track is None:
            records[0].track = get_random_string(16)
            db.session.commit()
            return redirect(url_for('done', session=session))
        else:
            raise Exception
    except Exception as e:
        print(e)
        return 'bad request', 400


@app.route('/done')
def done() -> str:
    return render_template('done.html')


if __name__ == '__main__':
    app.run(debug=True)
