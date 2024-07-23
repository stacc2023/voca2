from flask import Flask, request, jsonify
from sheet import get_sheets, get_sheet

app =Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)