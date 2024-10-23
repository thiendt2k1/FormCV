import pandas as pd
from datetime import datetime, timedelta, date
# from time import strftime
# import streamlit_authenticator
# import streamlit_pandas
# import streamlit
from flask import *
from flask_cors import CORS
from logging import FileHandler,WARNING

app = Flask(__name__, template_folder = 'C:/Users/Administrator/Desktop/CV/Form')
file_handler = FileHandler('errorlog.txt')
file_handler.setLevel(WARNING)
CORS(app)
df = pd.read_excel(r"D:\download\SỔ THEO DỎI NVL 102024.xlsx", usecols="A:R", sheet_name="Báo cáo hằng ngày")
masterSheet = pd.read_excel(r"D:\download\SỔ THEO DỎI NVL 102024.xlsx", usecols="A:D", sheet_name="MasterNVL")

# print(df)

# df = df.drop(columns=['ID','DỆT XÁC NHẬN', 'EMAIL DỆT', 'TÊN MÁY DỆT CẤP','CÔNG ĐOẠN XUẤT'])
# print(df['Mã VT'])
# meanArr = df.describe() #exclude only accept type
# print(meanArr['NGÀY NHẬP'])

# print(df['NGÀY NHẬP'][0])
# df['NGÀY NHẬP'] = df['NGÀY NHẬP'].apply(pd.to_datetime(df['NGÀY NHẬP']))
#timestamp, cant be converted
# df['NGÀY NHẬP'] = pd.to_datetime(df['NGÀY NHẬP'])
# # print(df['NGÀY NHẬP'][0])

# today = date.today()
# tmonth = today.month
# tyear = today.year
# firstDayThisMonth = datetime(tyear, tmonth, 1)
# print(firstDayThisMonth)
# today.strftime('Hôm nay là: %d, %m, %Y')
# print("Nhập sợi hôm nay:\n", df[df['NGÀY NHẬP'] >= pd.to_datetime(today)])
# print("Nhập sợi đầu tuần đến nay:\n", df[df['NGÀY NHẬP'] >= pd.to_datetime(today) - timedelta(days = datetime.now().weekday())])
# print("Nhập sợi đầu tháng đến nay:\n", df[df['NGÀY NHẬP'] >= pd.to_datetime(today).replace(day = 1)])
# print("Nhập sợi từ đầu năm đến nay:\n", df[df['NGÀY NHẬP'] >= pd.to_datetime(today).replace(day = 1, month=1)])

# SearchCode = input("Nhập sợi theo mã:").strip()
# print("Theo mã xuất kho", SearchCode, "là:\n", df[df['LỆNH XK'] == SearchCode])

# searchWidth = float(input("Nhập rộng sợi:").strip())
# print("Theo rộng sợi:", searchWidth,"\n", df[df['RỘNG SỢI'] == searchWidth])

# MXK, RS = input("MXK, RS: ").split()
# print("Theo mxk và rs: ", MXK, " " ,RS, "\n", df[(df['RỘNG SỢI'] == float(RS)) & (df['LỆNH XK'] == MXK)])

# @app.route("/")
# def show_tables():
#     data = pd.read_excel(r"C:\Users\Administrator\Desktop\DỮ LIỆU NXT TẠO SỢI_MỚI (64).xlsx", usecols="A:V", sheet_name="XUẤT SỢI HẰNG NGÀY")
#     return render_template('index.html',tables=[data.to_html(classes='mytable')],
#     titles = ['Excel Data to Flask'])

# @app.route('/insert', methods= ['POST','GET'])
# def insert():
#     df = pd.DataFrame({'a': [q1],
#                        'b': [q2]})

#     # book = pd.read_excel('example2.xlsx')
#     # writer = pd.ExcelWriter('example2.xlsx', engine='openpyxl')
#     # book.to_excel(writer, startrow=0, index=False)
#     # df.to_excel(writer, startrow=len(book) + 1, header=False, index=False)
#     # writer.save()
#     return redirect('/')

# @app.route('/save', methods= ['POST','GET'])
# def save():
#     url = 'http://127.0.0.1:5000/'
#     urll = request.get_data()
#     print(urll)
#     data = pd.read_html(urll)
#     print(data)
#     writer = pd.ExcelWriter('example2.xlsx', engine='openpyxl')
#     data[0].drop('Unnamed: 0', axis=1).to_excel(writer, sheet_name='Sheet1', index=False)

#     writer.save()
#     return redirect('/')

# if __name__ == "__main__":
#     app.run(debug=True)
@app.route('/', methods=['GET'])
def form():
    return render_template('frontend.html')

@app.route('/get-tenVT', methods=['GET'])
def get_tenvt_options():
    try:
        # Return distinct 'tenVT' values as JSON
        tenvt_list = masterSheet['Tên vật tư'].tolist()
        # print(tenvt_list)
        return jsonify({'tenVT': tenvt_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get MaVT and DVT when a tenVT is selected
@app.route('/get-mavt-dvt', methods=['GET'])
def get_mavt_and_dvt():
    try:
        # Get the selected Tên VT from query parameters
        ten_vt = request.args.get('tenVT', "")
        # Filter the DataFrame to find the matching row
        row = masterSheet[masterSheet['Tên vật tư'] == ten_vt].iloc[0]
        # Return the corresponding MaVT and DVT as JSON
        return jsonify({'MaVT': row['Mã VT'], 'DVT': row['Đơn \nvị']}), 200

    except IndexError:
        return jsonify({'error': 'No matching entry found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/nhapkho', methods=['POST'])
def save():
    data = request.get_json()

    # Append the new data into the DataFrame
    global masterSheet
    masterSheet = masterSheet.append(data, ignore_index=True)
    print("masterSheet", masterSheet)
    # Return a success response with the updated dataframe
    return jsonify({'message': 'Form data received', 'data': masterSheet.to_dict(orient='records')})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8000)