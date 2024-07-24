from flask import Flask, request, jsonify, send_file
from sheet import get_sheets, get_sheet
from tts import tts

app = Flask(__name__)
# in production
# app = Flask(__name__, static_folder='../client/build/static', template_folder='../client/build')

# when the home page loaded, first get the list of name of sheets
@app.route('/sheets')
def sheets():
    return [sh.title for sh in get_sheets()]

# when a user clicks a sheet name, 
@app.route('/sheet/<name>')
def sheet(name):
    return get_sheet(name).get_all_values()

# when a user clicks the 'yes' or 'no' button
@app.route('/check', methods=['POST'])
def check():
    data = request.get_json()
    sheet_name = data.get('sheet')
    row = data.get('index')
    test_type = data.get('type')
    col = 1 if test_type == 'en' else 4
    value = data.get('value')

    sh = get_sheet(sheet_name)
    sh.update_cell(row, col, value)
    
    return jsonify({'message': 'Value received', 'value': value})

@app.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    file_path = tts(text)

    return send_file(file_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
    # in production
    # app.run(port=3001, host='0.0.0.0')