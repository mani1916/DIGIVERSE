from flask import Flask, request, jsonify
from openpyxl import load_workbook  
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error,mean_squared_error,r2_score
app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def concatenate():
    # print("hi")
    file = request.files['file']
    periodicity = request.form['periodicity']
    p = int(request.form['period'])
    # print("hi")
    print(p)
    print(periodicity)
    print(file.name)
    
    sales_data=pd.read_csv(file)
    sales_data = sales_data.fillna(0)


    #drop the unwanted columns
    sales_data=sales_data.drop(['store','item'],axis=1)

 
    #convert date object to date data tye
    sales_data['date']=pd.to_datetime(sales_data['date'])
    if(periodicity=="D"):
        old=sales_data[-p:].reset_index(drop=True);
        sales_data['sales-diff']=sales_data['sales'].diff()
        send_sales=sales_data.dropna()

    #converting date to month or year and store the sum of sales
    if(periodicity=="M"):
        sales_data['date']=sales_data['date'].dt.to_period("M")
        sales_data['date']=sales_data['date'].dt.to_timestamp()
        monthly_sales=sales_data.groupby('date').sum().reset_index()
        old=monthly_sales[-p:].reset_index(drop=True)
        monthly_sales['sales-diff']=monthly_sales['sales'].diff()
        send_sales=monthly_sales.dropna()



    # print(new)
    if(periodicity=="Y"):
        sales_data['date']=sales_data['date'].dt.to_period("M")
        sales_data['date']=sales_data['date'].dt.to_timestamp()

        monthly_sales=sales_data.groupby('date').sum().reset_index()
        yearly_sales = monthly_sales.set_index('date').resample('Y').sum()
        # sales_data['date']=sales_data['date'].dt.to_timestamp()
        # Convert 'date' index back to pandas Timestamp object
        yearly_sales = yearly_sales.reset_index()
        old=yearly_sales[-p:].reset_index(drop=True)
        yearly_sales['sales-diff']=yearly_sales['sales'].diff()
        send_sales=yearly_sales.dropna()

    #prediction

    supervised_data=send_sales.drop(['date','sales'],axis=1)
    if(periodicity=="Y"):
        if(p>int((send_sales.shape[0])/2)):
            p=int((send_sales.shape[0])/2)
        
    for i in range (1,p+1):
        col_name='month_'+str(i)
        supervised_data[col_name]=supervised_data['sales-diff'].shift(i)
    supervised_data=supervised_data.dropna().reset_index(drop=True)


    #split the data into train data and test data

    train_data=supervised_data[:-p]
    if(periodicity=="Y"):
        train_data=supervised_data
    test_data=supervised_data[-p:]

    #minmax scaler
    scaler=MinMaxScaler(feature_range=(-1,1))
    scaler.fit(train_data)
    train_data=scaler.transform(train_data)
    test_data=scaler.transform(test_data)

    # print(train_data)
    x_train,y_train=train_data[:,1:],train_data[:,0:1]
    x_test,y_test=test_data[:,1:],test_data[:,0:1]
    y_train=y_train.ravel()
    y_test=y_test.ravel()

    sales_date=send_sales['date'][-p:].reset_index(drop=True)
    predict_df=pd.DataFrame(sales_date)

    act_sales=send_sales['sales'][-p:].reset_index(drop=True)


    #linear regresssion
    lr_model= LinearRegression()
    lr_model.fit(x_train,y_train)
    lr_pre=lr_model.predict(x_test)

    lr_pre=lr_pre.reshape(-1,1)
    lr_pre_set=np.concatenate([lr_pre,x_test],axis=1)
    lr_pre_set=scaler.inverse_transform(lr_pre_set)


    #result of prediction data
    result=[]
    for index in range(0,len(lr_pre_set)):
        result.append(lr_pre_set[index][0]+act_sales[index])
    lr_pre_series=pd.Series(result,name="sales")
    # print(predict_df)
    predict_df=predict_df.merge(lr_pre_series,left_index=True,right_index=True)
# 
    # print(predict_df)

    json_data = old.to_json(orient='records')
    res=predict_df.to_json(orient='records')
    print(json_data)
    print(res)
    res_data =[
    {"data1":json_data},{"data2":res}
    ]
    
    print(res_data)
    return jsonify(res_data)
    
if __name__ =='__main__':   
    app.run(debug=True)