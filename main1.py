"""Fast API for TRC"""
from fastapi import FastAPI, UploadFile,File
from typing import Optional
from arcgis.gis import GIS
from arcgis.features import FeatureLayer
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel
import pandas as pd
import copy
import geopandas as gpd
import aiofiles
from sklearn.linear_model import LinearRegression
from sklearn import preprocessing
from sqlalchemy import create_engine


app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class SubLayer(BaseModel):
    user: str
    password: str
    layerName : str


class SubLayer1(BaseModel):
    user: str
    password: str
    layerName: str
    Arr : list[list]
    GR : list

class AddColumn(BaseModel):
    user: str
    password: str
    layerName : str
    columns : list

# class Dataset(BaseModel):
#     file : file
#     text : str

@app.post("/whole-table-data-byrow")
async def table_data(tableData: SubLayer):
    """ It takes username, password, and layer name as a parameter,
    returns whole talbe data including rows having invalid data
    in row wise format"""
    try:
        gis = GIS("https://trcintegrity.maps.arcgis.com/",
                  tableData.user, tableData.password)
    except:
        return {"msg": "Invalid Username or Password"}

    my_content = gis.content.search('title: '+ tableData.layerName,
                                    item_type='Feature Layer')

    try:
        for i in my_content:
            if tableData.layerName == i.title:
                break
        url = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}

    layer = FeatureLayer(url)
    try:
        layer_obj = layer.query(where='1=1')
    except:
        return {'msg': 'Invalid URL'}

    sdf = layer_obj.sdf.copy()

    drop_columns = list(sdf.select_dtypes('geometry').columns)
    if len(drop_columns)>0:
        sdf.drop(columns=drop_columns,inplace=True)
    column_name = list(sdf.columns)
    sdf['isInvalid'] = ''
    sdf.replace("N/A",'',inplace=True)
    sdf.replace(np.nan,'',inplace=True)
    sdf.replace('Null','',inplace=True)
    sdf.replace('null','',inplace=True)
    sdf.replace('NULL','',inplace=True)

    for i in sdf.index:
        missing_data = []
        invalid_data = []

        for j in column_name:
            if str(sdf.loc[i, j]).strip() == '':
                missing_data.append(j)
                continue
            if j.lower() == 'birthdate':
                if len(str(sdf.loc[i, j]))!=4:
                    invalid_data.append(j)
            if j.lower() == 'height':
                if isinstance(sdf.loc[i, j],int):
                    if not (sdf.loc[i, j] >=15 and sdf.loc[i, j] <=90):
                        invalid_data.append(j)
                else:
                    try:
                        if not (int(sdf.loc[i, j]) >=15 and int(sdf.loc[i, j]) <=90):
                            invalid_data.append(j)
                    except:
                        invalid_data.append(j)

        if len(missing_data) > 0 or len(invalid_data) > 0:
            sdf.loc[i, 'isInvalid'] = [{'missing_data' : missing_data,'inaccurate_data' : invalid_data}]

    if sdf.shape[0] == 0:
        return {'msg': 'No data'}
    return {'table': sdf.to_dict('records')}


#Field validation api >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


@app.post("/whole-table-highlight-data-byrow")
async def table_data(tableData: SubLayer):
    """ It takes username, password, and layer name as a parameter, returns whole talbe data including old highlighted data."""
    try:
        gis = GIS("https://trcintegrity.maps.arcgis.com/",
                  tableData.user, tableData.password)
    except:
        return {"msg": "Invalid Username or Password"}
    
    my_content_field1 = gis.content.search('title: '+ tableData.layerName,
                                    item_type='Feature Layer')
    
    

    layerName1 = tableData.layerName.split("_")
    layerName1 = "_".join(layerName1[0:len(layerName1)-1]) + "1"
    # layerName1 = tableData.layerName[:(len(tableData.layerName)-1)]+'_field1' 
    my_content1 = gis.content.search('title: '+ layerName1,
                                    item_type='Feature Layer')
  
    try:
        for i in my_content1:
            if layerName1 == i.title:
                break
        url1 = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}

    # for field1
    try:
        for i in my_content_field1:
            if tableData.layerName == i.title:
                break
        url_field1 = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}


    layer1 = FeatureLayer(url1)
    layer_field1 = FeatureLayer(url_field1)

    

    try:
        layer_obj1 = layer1.query(where='1=1')
    except:
        return {'msg': 'Invalid URL1'}
    # for field1 layer
    try:
        layer_obj_field1 = layer_field1.query(where='1=1')
    except:
        return {'msg': 'Invalid URL2'}

    sdf = layer_obj1.sdf

    sdf_field1 = layer_obj_field1.sdf

    # drop_columns=sdf["SHAPE"]
    drop_columns = list(sdf.select_dtypes('geometry').columns)
    # drop_columns_field1=sdf_field1["SHAPE"]
    drop_columns_field1 = list(sdf_field1.select_dtypes('geometry').columns)

    if len(drop_columns)>0:
        # del sdf["SHAPE"]
        sdf.drop(columns=drop_columns,inplace=True)
    column_name = list(sdf.columns)
    sdf['isInvalid'] = ''
    sdf.replace("N/A",'',inplace=True)
    sdf.replace(np.nan,'',inplace=True)
    sdf.replace('Null','',inplace=True)
    sdf.replace('null','',inplace=True)
    sdf.replace('NULL','',inplace=True)

    # for field1
    if len(drop_columns_field1)>0:
        # del sdf_field1["SHAPE"]
        sdf_field1.drop(columns=drop_columns_field1,inplace=True)
    column_name1 = list(sdf_field1.columns)
    sdf_field1['isInvalid'] = ''
    sdf_field1.replace("N/A",'',inplace=True)
    sdf_field1.replace(np.nan,'',inplace=True)
    sdf_field1.replace('Null','',inplace=True)
    sdf_field1.replace('null','',inplace=True)
    sdf_field1.replace('NULL','',inplace=True)
    
    if len(sdf.index) < len(sdf_field1.index):
        index1 = sdf.index
    else:
        index1 = sdf_field1.index
                    
    for i in index1:
        missing_data1 = []
        invalid_data1 = []
        missing_data = []
        invalid_data = []
        for j in column_name1:
            if str(sdf_field1.loc[i, j]).strip() == '':
                missing_data1.append(j)
                continue
            if str(sdf.loc[i, j]).strip() == '':
                missing_data.append(j)
                continue
            #'BirthDate', 'Height'
            if j.lower() == 'birthdate':
                if len(str(sdf_field1.loc[i, j]))!=4:
                    invalid_data1.append(j)
                if len(str(sdf.loc[i, j]))!=4:
                    invalid_data.append(j)
            if j.lower() == 'height':
                if isinstance(sdf_field1.loc[i, j],int):
                    if not (sdf_field1.loc[i, j] >=15 and sdf_field1.loc[i, j] <=90):
                        invalid_data1.append(j)
                else:
                    try:
                        if not (int(sdf_field1.loc[i, j]) >=15 and int(sdf_field1.loc[i, j]) <=90):
                            invalid_data1.append(j)
                    except:
                        print("in except field")
                        invalid_data1.append(j)
                        
                # for ss
                if isinstance(sdf.loc[i, j],int):
                    if not (sdf.loc[i, j] >=15 and sdf.loc[i, j] <=90):
                        invalid_data.append(j)
                else:
                    try:
                        if not (int(sdf.loc[i, j]) >=15 and int(sdf.loc[i, j]) <=90):
                            invalid_data.append(j)
                    except:
                        print("in except", j)
                        invalid_data.append(j)
                        
        missing_data1.extend(missing_data)
        invalid_data1.extend(invalid_data)
        
        missing_data1 = list(set(missing_data1))
        invalid_data1 = list(set(invalid_data1))
        
        if len(missing_data1) > 0 or len(invalid_data1) > 0:
                sdf_field1.loc[i, 'isInvalid'] = [{'missing_data' : missing_data1,'inaccurate_data' : invalid_data1}]

    if sdf_field1.shape[0] == 0:
        return {'msg': 'No data'}
    return {'table': sdf_field1.to_dict('records')}


#Field validation as per config widget

@app.post("/whole-table-data-byrow-with-config-field")
def table_data(tableData: SubLayer1):
    global sdf_field1

    """ It takes username, password, and layer name as a parameter, returns whole talbe data including old highlighted data."""
    try:
        gis = GIS("https://trcintegrity.maps.arcgis.com/",
                  tableData.user,tableData.password)
    except:
        return {"msg": "Invalid Username or Password"}
    
    my_content_field1 = gis.content.search('title: '+ tableData.layerName,
                                    item_type='Feature Layer')
    
    

    layerName1 = tableData.layerName.split("_")
    layerName1 = "_".join(layerName1[0:len(layerName1)-1]) + "1"
    # layerName1 = tableData.layerName[:(len(tableData.layerName)-1)]+'_field1' 
    my_content1 = gis.content.search('title: '+ layerName1,
                                    item_type='Feature Layer')
  
    try:
        for i in my_content1:
            if layerName1 == i.title:
                break
        url1 = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}

    # for field1
    try:
        for i in my_content_field1:
            if tableData.layerName == i.title:
                break
        url_field1 = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}


    layer1 = FeatureLayer(url1)
    layer_field1 = FeatureLayer(url_field1)

    

    try:
        layer_obj1 = layer1.query(where='1=1')
    except:
        return {'msg': 'Invalid URL1'}
    # for field1 layer
    try:
        layer_obj_field1 = layer_field1.query(where='1=1')
    except:
        return {'msg': 'Invalid URL2'}

    sdf = layer_obj1.sdf

    
    sdf_field1 = layer_obj_field1.sdf

    # drop_columns=sdf["SHAPE"]
    drop_columns = list(sdf.select_dtypes('geometry').columns)
    # drop_columns_field1=sdf_field1["SHAPE"]
    drop_columns_field1 = list(sdf_field1.select_dtypes('geometry').columns)

    if len(drop_columns)>0:
        # del sdf["SHAPE"]
        sdf.drop(columns=drop_columns,inplace=True)
    column_name = list(sdf.columns)
    sdf['isInvalid'] = ''
    sdf.replace("N/A",'',inplace=True)
    sdf.replace(np.nan,'',inplace=True)
    sdf.replace('Null','',inplace=True)
    sdf.replace('null','',inplace=True)
    sdf.replace('NULL','',inplace=True)

    # for field1
    if len(drop_columns_field1)>0:
        # del sdf_field1["SHAPE"]
        sdf_field1.drop(columns=drop_columns_field1,inplace=True)
    column_name1 = list(sdf_field1.columns)
    sdf_field1['isInvalid'] = ''
    sdf_field1.replace("N/A",'',inplace=True)
    sdf_field1.replace(np.nan,'',inplace=True)
    sdf_field1.replace('Null','',inplace=True)
    sdf_field1.replace('null','',inplace=True)
    sdf_field1.replace('NULL','',inplace=True)
    
    if len(sdf.index) < len(sdf_field1.index):
        index1 = sdf.index
    else:
        index1 = sdf_field1.index
                    
    for i in index1:
        missing_data1 = []
        invalid_data1 = []
        missing_data = []
        invalid_data = []
        
        if "is_null" in tableData.GR:
            for j in column_name1:
                # print(f'colmn--------- {j}')
                if str(sdf_field1.loc[i, j]).strip() == '':
                    missing_data1.append(j)
                if str(sdf.loc[i, j]).strip() == '':
                    missing_data.append(j)
        for j in tableData.Arr:
            column_name = j[0]
            r = j[1]

            if r.lower() == 'is_null':
                if str(sdf_field1.loc[i, column_name]).strip() == '':
                    missing_data1.append(column_name)
                if str(sdf.loc[i, j]).strip() == '':
                    missing_data.append(j)
            if r.lower() == 'year':
                if len(str(sdf_field1.loc[i, column_name]))!=4:
                    invalid_data1.append(column_name)
                if len(str(sdf.loc[i, column_name]))!=4:
                    invalid_data.append(column_name)
            if r.lower() == 'range':
                if isinstance(sdf_field1.loc[i, column_name],int):
                    if not (sdf_field1.loc[i, column_name] >=15 and sdf_field1.loc[i, column_name] <=90):
                        invalid_data1.append(column_name)
                else:
                    try:
                        if not (int(sdf_field1.loc[i, column_name]) >=15 and int(sdf_field1.loc[i, column_name]) <=90):
                            invalid_data1.append(column_name)
                    except:
                        print("in except field")
                        invalid_data1.append(column_name)
                        
                # for ss
                if isinstance(sdf.loc[i, column_name],int):
                    if not (sdf.loc[i, column_name] >=15 and sdf.loc[i, column_name] <=90):
                        invalid_data.append(column_name)
                else:
                    try:
                        if not (int(sdf.loc[i, column_name]) >=15 and int(sdf.loc[i, column_name]) <=90):
                            invalid_data.append(column_name)
                    except:
                        print("in except", column_name)
                        invalid_data.append(column_name)
                        
        missing_data1.extend(missing_data)
        invalid_data1.extend(invalid_data)
        
        missing_data1 = list(set(missing_data1))
        invalid_data1 = list(set(invalid_data1))
        
        if len(missing_data1) > 0 or len(invalid_data1) > 0:
                sdf_field1.loc[i, 'isInvalid'] = [{'missing_data' : missing_data1,'inaccurate_data' : invalid_data1}]

    if sdf_field1.shape[0] == 0:
        return {'msg': 'No data'}
    return {'table': sdf_field1.to_dict('records')}


@app.post("/add_column")
async def add_comun(add_column : AddColumn):
    try:
        gis = GIS("https://trcintegrity.maps.arcgis.com/", add_column.user, add_column.password)
    except:
        return {"msg":"Invalid Username or Password"}

    search_result = gis.content.search( 'title: ' + add_column.layerName,item_type="Feature Layer" )
    try:
        for i in search_result:
            if add_column.layerName ==  i.title:
                break
        url = i.layers[0].url
        layer = FeatureLayer(url)
    except:
        return {"msg": "Invalid Layer name"}
    
    for col_name in add_column.columns:
        new_field = {
        "name": col_name,
        "type": "esriFieldTypeString",
        "alias": col_name,
        "length": 30,
        "nullable": True,
        "editable": True,
        "visible": True,
        "domain": None
        }
        update_dict = {"fields": [new_field]}
    try:
        add_column=layer.manager.add_to_definition(update_dict)
        return add_column
    except:
        return{"msg":"column name already exist"}


import json
@app.post("/null_prediction/")
async def predict_null(addText : Optional[str]=None , file: Optional[UploadFile] = None):
    file_location = f"/home/admin1/Desktop/Amol/files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
   

#     # check file is csv
    if file.filename.split("/")[-1].split(".")[-1] == "csv":
    # if path.filename.split("/")[-1].split(".")[-1] == "csv":
        print("if block")
        df = pd.read_csv(file_location , encoding='unicode_escape') # encoding='latin1'
    
#     #check file is excel
    elif file.filename.split("/")[-1].split(".")[-1] == "xlsx" :
        print("elif block")
        df = pd.read_excel(file_location)
#     #check file is shape file
    elif file.filename.split("/")[-1].split(".")[-1] == "shp":
        print("elif2 block")
        df = gpd.read_file(file_location)
        try:
            df = df.drop('geometry',axis=1)
        except:
            pass
        
    #for database
    else:
        engine = create_engine('postgresql://postgres:Shri@localhost/postgres')
        df = pd.read_sql(addText,con=engine)
        df = df.drop('index',axis=1)
    #     display(df)

    df1 = copy.deepcopy(df)
    columns = df1.columns
    df1["isInvalid"] = ''
    df1.replace("N/A",'',inplace=True)
    df1.replace(np.nan,'',inplace=True)
    df1.replace('Null','',inplace=True)
    df1.replace('null','',inplace=True)
    df1.replace('NULL','',inplace=True)
    # df1.head(10)
    # missing_data = []
    for i in df1.index:
        missing_data = []
        for j in columns:
            if str(df1.loc[i, j]) == '':
                missing_data.append(j)             
                df1.loc[i, 'isInvalid'] =  missing_data
    # df1
    df = df.replace(r'^\s+$', np.nan, regex=True)
    df = df.replace('', np.NaN)
    columns = df.columns
    for current_col in columns:
        df_test = df[df[current_col].isnull()] 
        if df_test.empty:
            pass
        else:
            df_train = df[df[current_col].notna()]
            Dtype = df.dtypes[current_col]
            if not Dtype == 'object':
                df_train.dropna(inplace=True)
                x_train = df_train.drop(current_col, axis=1)
                y_train = df_train[current_col]
                lr = LinearRegression()
                le = preprocessing.LabelEncoder()

                for column_name in x_train.columns:
                    if x_train[column_name].dtype == object:
                        x_train[column_name] = le.fit_transform(x_train[column_name])  
                    else:
                        pass 

                lr.fit(x_train, y_train)

                for column in df_test.columns:
                    if not column==current_col:
                        df_test = df_test[df_test[column].notna()]

                x_test = df_test.drop(current_col, axis=1)
                le = preprocessing.LabelEncoder()

                for column_name in x_test.columns:
                    if x_test[column_name].dtype == object:
                        x_test[column_name] = le.fit_transform(x_test[column_name])
                    else:
                        pass

                y_pred = lr.predict(x_test)
                df_test[current_col] = y_pred
                for i in df_test.index:
                    df.loc[i] = df_test.loc[i]
    df["isInvalid"] = df1["isInvalid"]





    import json
    # df["isInvalid"] = df1["isInvalid"]
    df = df.fillna('')
    df.insert(0, 'S.N.', df.index)
    result = df[:100]
    result = result.to_dict('records')
    return {"table": result}


# ###########################New api for primary validation as per configuration

@app.post("/whole-table-data-byrow-with-config")
async def table_data(tableData : SubLayer1):
    """ It takes username, password, and layer name as a parameter,
    returns whole talbe data including rows having invalid data
    in row wise format"""
    try:
        gis = GIS("https://trcintegrity.maps.arcgis.com/",
                  tableData.user, tableData.password)
    except:
        return {"msg": "Invalid Username or Password"}

    my_content = gis.content.search('title: '+ tableData.layerName,
                                    item_type='Feature Layer')

    try:
        for i in my_content:
            if tableData.layerName == i.title:
                break
        url = i.layers[0].url

    except:
        return {"msg": "Invalid Layer name"}

    layer = FeatureLayer(url)
    try:
        layer_obj = layer.query(where='1=1')
    except:
        return {'msg': 'Invalid URL'}

    sdf = layer_obj.sdf.copy()

    drop_columns = list(sdf.select_dtypes('geometry').columns)
    if len(drop_columns)>0:
        sdf.drop(columns=drop_columns,inplace=True)
    column_name = list(sdf.columns)
    sdf['isInvalid'] = ''
    sdf.replace("N/A",'',inplace=True)
    sdf.replace(np.nan,'',inplace=True)
    sdf.replace('Null','',inplace=True)
    sdf.replace('null','',inplace=True)
    sdf.replace('NULL','',inplace=True)
    for i in sdf.index:
        missing_data = []
        invalid_data = []
        if "is_null" in tableData.GR:
            for j in column_name:
                # print(f'column ------ {j}')
                if str(sdf.loc[i, j]).strip() == '':
                    missing_data.append(j)


        for j in tableData.Arr:
            column_name1 = j[0]
            r = j[1]
        
            if r.lower() == 'is_null':
                try:
                    if str(sdf.loc[i, column_name1]).strip() == '':
                        missing_data.append(column_name1)
                except:
                    return {"msg" : "Invailid column selected"}
        
            if r.lower() == 'year':
                try:
                    if len(str(sdf.loc[i, column_name1]))!=4:
                        invalid_data.append(column_name1)
                except:
                    return {"msg" : "Invailid column selected"}    

            if r.lower() == 'range':
                try:
                    if isinstance(sdf.loc[i, column_name1],int):
                        if not (sdf.loc[i, column_name1] >=15 and sdf.loc[i, column_name1] <=90):
                            invalid_data.append(column_name1)
                    else:
                        try:
                            if not (int(sdf.loc[i, column_name1]) >=15 and int(sdf.loc[i, column_name1]) <=90):
                                invalid_data.append(column_name1)
                        except:
                            invalid_data.append(column_name1)
                except:
                    return {"msg" : "Invalid column selected"}  

                

        if len(missing_data) > 0 or len(invalid_data) > 0:
            sdf.loc[i, 'isInvalid'] = [{'missing_data' : missing_data,'inaccurate_data' : invalid_data}]

    if sdf.shape[0] == 0:
        return {'msg': 'No data'}
    return {'table': sdf.to_dict('records')}
    