import {
    makeStyles,
} from '@material-ui/core'
import { useState,forwardRef, useContext, useRef, useEffect} from 'react';
import {useImperativeHandle } from 'react';
import { Context } from './index';
import { Stage, Layer, Group, Rect, Text, Circle, Line } from 'react-konva';
// import {ModelInstanceEntity} from '~/api/interfaces'
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(() => ({
    convasContainer:{
        height: '100%'
    }
}));

// DTY数据格式化
const dataFormat =(data: any) => {
    let dataString:string = ''
    for (let [key, value] of Object.entries(data)){
        dataString += `${key}:${value}\n`
    }
    return dataString
}
export const CanvaContainerRK = forwardRef((props: any, ref: any) => {
    let cWidth = document.getElementById('canvas-container')?.clientWidth
    let cHeight = document.getElementById('canvas-container')?.clientHeight
    const {type, setType, editRect, setEditRect} = useContext(Context);
    let { DTYClick, plantClick, setBtnDisable, DTYProTem, plantProTem} = props;
    const stageRef: any = useRef(null)
    const linesRef: any = useRef(null)
    const [stageXY, setStageXY] = useState({})
    const [plantIfCreated, setPlantIfCreated] = useState(false)
    const [plantGroupArg, setPlantGroupArg] = useState({})
    const [plantLineBorderArg, setPlantLineBorderArg] = useState({})
    const [plantEidtRectArg, setPlantEidtRectArg] = useState({})
    const [plantEidtTextArg, setPlantEidtTextArg] = useState({})
    const [preRectSelected, setPreRectSelected] = useState<String>('')
    const [curPointMouseUpName, setCurPointMouseUpName] = useState<String>('')
    // 保存每次plant和DTY创建的值
    const [plantPropertyData, setPlantPropertyData] = useState({})
    const [DTYPropertyData, setDTYPropertyData] = useState<Array<Object|undefined>>([])
    // DTY数组
    const [DTYArr, setDTYArr] = useState<any[]>([])

    // 保存的请求体数据格式化
    const modelTemplatePropertyCreator = (modelInstances:any, modelTemplate:any, parentId:any) => {
            let modelInstanceProperties: Array<Object | undefined> = []
            let name:string = ''
            for(let key of Object.keys(modelInstances)){
                if(key === 'Name'){
                    name = modelInstances[key]
                    continue;
                }    
                let objTem = {
                    id: uuidv4(),
                    modelInstanceId: uuidv4(),
                    templatePropertyId: uuidv4(),
                    propertyName: key,
                    propertyValue: modelInstances[key]
                }
                modelInstanceProperties.push(objTem)
            }
        let modelInstancesObj = {
            id: uuidv4(),
            modelTemplateId: uuidv4(),
            name,
            parentId,
            description: modelTemplate.description,
            modelInstanceProperties,
            modelInstanceRelation:[],
            modelTemplate,
            subModelInstances:[]
        }
        return modelInstancesObj
    }
    const saveDataFormate = () => {
        let PlantModelInstances:any = modelTemplatePropertyCreator(plantPropertyData,plantProTem,'')
        let DTYsModelInstances = DTYPropertyData.map(v => modelTemplatePropertyCreator(v, DTYProTem,PlantModelInstances.id))
        PlantModelInstances.subModelInstances = [...DTYsModelInstances] 
        console.log(PlantModelInstances)
    }

    const saveCanvas = () => {
        saveDataFormate()
        let saveData: any= {
            stageXY,
            DTYArr,
            plantGroupArg,
            plantEidtRectArg,
            plantLineBorderArg,
            plantEidtTextArg
        }
        // console.log('plant',plantPropertyData)
        // console.log('DTY',DTYPropertyData)
        localStorage.setItem('saveData', JSON.stringify(saveData));
    }
    const importCanvas = () => {
        let saveData: any = JSON.parse((localStorage.getItem('saveData')) as any);
        setPlantIfCreated(true)
        setStageXY(saveData?.stageXY)
        setPlantGroupArg(saveData?.plantGroupArg)
        setDTYArr(saveData?.DTYArr)
        setPlantEidtRectArg(saveData?.plantEidtRectArg)
        setPlantLineBorderArg(saveData?.plantLineBorderArg)
        setPlantEidtTextArg(saveData?.plantEidtTextArg)
        setBtnDisable(false) 
    }
    const hanleStageDragEnd =  (e:any) => {
        if(e.target.getType() == 'Stage'){
            setStageXY({
                x: e.target.x(),
                y: e.target.y()
            })
        }
        if(e.target.getType() == 'Group'){
            setDTYArr(DTYArr.map(v=> {
                if(v.DTYGroupArg.name === e.target.name()){
                    v.DTYGroupArg = Object.assign(v.DTYGroupArg,{x: e.target.x(),y: e.target.y()})
                }
                return v
            } ))       
        }     
    }
    // 绘制的Line
    const [newLine, setNewLine] =  useState<any>(null)
    const [lineArr, setLineArr] =  useState<any[]>([])
    // 创建工厂
    const createPlant = (data: any) => {
        setPlantIfCreated(true)
        setPlantPropertyData(data)
        let {Length:width, Width:height} = data
        width = Number(width)
        height = Number(height)
        let gx =  ((cWidth as any) - width)/2
        let gy = ((cHeight as any) - height)/2
        let plantGroupArgTem = {
            x: gx,
            y: gy,
            width,
            height,
        }
        setPlantGroupArg(plantGroupArgTem)
        let points = [0, 0, width, 0, width, height, 0, height, 0, 0]
        setPlantLineBorderArg({points})
        // plant的编辑按钮以及文字
        let pEditRectW = 50
        let pEditRectH = 25
        let plantEidtRectArgTem = {
            x: -pEditRectW,
            y: 0,
            width: pEditRectW,
            height: pEditRectH,
        }
        setPlantEidtRectArg(plantEidtRectArgTem)
        // 文字
        let plantEidtTextArgTem = {
            width: pEditRectW,
            height: pEditRectH,
            x: -pEditRectW,
            y: 0,
        }
        setPlantEidtTextArg(plantEidtTextArgTem)
    }
    // 编辑工厂
    const editPlant = (plantData: any) => {
        setPlantPropertyData(plantData)
        let {Length: width, Width: height} = plantData;
        let gx =  ((cWidth as any) - width)/2;
        let gy = ((cHeight as any) - height)/2;
        let plantGroupArgTem = {
            x: gx,
            y: gy,
            width,
            height,
        }
        setPlantGroupArg(plantGroupArgTem)
        let points = [0, 0, width, 0, width, height, 0, height, 0, 0];
        setPlantLineBorderArg({points})
    }
    const handMouseEnterStyle = () => {
        (document.getElementById('canvas-container') as any).style.cursor = 'pointer';
    }
    const handMouseLeaverStyle = () => {
        (document.getElementById('canvas-container') as any).style.cursor = 'default';
    }

    // 创建DTY
    const createDTY = (data: any) => {
        let {Length : DTYWidth, Width : DTYHeight} = data
        DTYWidth = Number(DTYWidth)
        DTYHeight = Number(DTYHeight)
        let marginLeft = 10
        let maringinTop = 10
        // DTY的组
        let endNumName = type == 'edit' ? editRect.name().match(/\d+/g).join('') : DTYArr.length
        let DTYGroupArg = {
            name:'DTY'+ endNumName,
            width: DTYWidth,
            height: DTYHeight,
            draggable: true,
        }
        // DTY的矩形
        let DTYRect = {
            name: 'DTYRect'+ endNumName,
            width: DTYWidth,
            height: DTYHeight,
            stroke: 'black',
            strokeWidth: 1
        }
        // DTY的文字
        // let dataText = dataFormat(data)
        let DTYText = {
            name: 'DTYtext'+ endNumName,
            text: `${data.Name}\n(${data.WindingTime})`,
            width: DTYWidth,
            height: DTYHeight,
            fontSize: 14,
            fontFamily: 'Calibri',
            fill: '#1d39c4',
            align: 'center',
            verticalAlign: 'middle'
        }
        // 定义group的四个连线点
        let nameList = ['topPoint', 'rightPoint', 'bottomPoint', 'leftPoint']
        // 四个点坐标
        let top = {
            x: DTYWidth/2,
        }
        let right = {
            x: DTYWidth,
            y: DTYHeight/2
        }
        let bottom = {
            x: DTYWidth/2,
            y: DTYHeight
        }
        let left = {
            y: DTYHeight/2
        }
        let pointXYs = [top, right, bottom, left]
        let pointsList = nameList.map((v, i) => {
            let pointArg: any = {
                ...pointXYs[i],
                name: v + endNumName,
                fill:'red',
                stroke:'black',
                strokeWidth: 1,
                radius: 4,
            }
            return pointArg
        })

        let newDTY = {
            data,
            DTYGroupArg,
            DTYRect,
            DTYText,
            pointsList
        } 
        if(type == 'create'){
            setDTYPropertyData([...DTYPropertyData, data])
            setDTYArr([...DTYArr,  newDTY])
        }else{
            setDTYPropertyData(DTYPropertyData.map((v:any) => v?.Name === data.Name ? data : v))
            setDTYArr(DTYArr.map(v => {
                if(v.DTYRect.name === editRect.name()){
                    // x,y坐标需要保留
                    newDTY.DTYGroupArg = Object.assign(v.DTYGroupArg, newDTY.DTYGroupArg)
                    return newDTY
                }
                return v
            }))
            setType('create')
        }
        
    }
    // DTY双击编辑
    const handleDTYDblClick = (data:any, e:any) => {
        setType('edit')
        setEditRect(e.target)
        DTYClick(data)
    }
    // DTY点击选中
    const handleDTYClick = (e:any) => {
        setDTYArr(DTYArr.map(v => {
            v.DTYRect = Object.assign(v.DTYRect,{stroke: 'black',strokeWidth: 1,shadowBlur: 0})
            if(v.DTYRect.name === e.target.name()){
                if(preRectSelected !== e.target.name()){
                    v.DTYRect = Object.assign(v.DTYRect,{stroke: '#5cbcfc',strokeWidth: 3,shadowBlur: 1})
                    setPreRectSelected(e.target.name())
                }else{
                    // v.DTYRect = Object.assign(v.DTYRect,{stroke: 'black',strokeWidth: 1,shadowBlur: 0})
                    setPreRectSelected('')
                }
            }
            return v
        }))
    }
    // 统一处理鼠标事件中点的parent和stage的拖拽属性
    const entityDraggableSetting = (e: Event & { target: Element }, status: boolean) => {
        let pointEntityParentGroup = (e.target as any).parent
        // let plantEntityGroup = pointEntityParentGroup.parent
        pointEntityParentGroup.draggable(status);
        // plantEntityGroup.draggable(status)
        stageRef.current.draggable(status)
    }
    // 圆点移入事件
     const handleEnterPoint = (e: any) => {
        handMouseEnterStyle()  
        let pointEntity = e.target
        pointEntity.radius(6)
        pointEntity.stroke('#00ff00')
     }
     // 圆点移出事件
     const handleLeavePoint = (e: any) => {
        handMouseLeaverStyle()
        let pointEntity = e.target
        pointEntity.radius(4)
        pointEntity.stroke('black')
        entityDraggableSetting(e, true)
    }
    // 鼠标落下事件
    const handleDownPoint = (e: any) => {
        setCurPointMouseUpName(e.target.name())
        entityDraggableSetting(e, false)
        let pointEntity = e.target
        // 获取鼠标落点
        const pointEntityClickPos = stageRef.current.getPointerPosition()
        let pointXY = pointEntity.absolutePosition()
        // stage拖拽时坐标原点改变，修正线的偏移量
        let stageX = stageRef.current.x()
        let stageY = stageRef.current.y()
        let points = [pointXY.x - stageX, pointXY.y-stageY, 
            pointEntityClickPos.x- stageX, pointEntityClickPos.y-stageY]
        let newLineArg = {
            name: 'line' + lineArr.length,
            stroke: 'black',
            points
        }
        let newLineTem = <Line ref={linesRef} key={'newline' + lineArr.length} {...newLineArg}></Line>
        setLineArr([...lineArr,newLineTem])
        setNewLine(newLineTem)
        
    }
    // 鼠标移动事件
    const handleMoveLine = (e: any) => {
        if(!newLine){
            return
        }
        let stageX = stageRef.current.x()
        let stageY = stageRef.current.y()
        const pos = stageRef.current.getPointerPosition();
        const points = linesRef.current.points().slice();
        // let stageX = (stageRef.current.x()
        // let stageY = (stageRef.current.y()
        points[2] = pos.x - stageX;
        points[3] = pos.y-stageY;
        linesRef.current.points(points);
        
    }
    // 画线鼠标抬起事件
    const handleUpStage = (e: any) => {
        if(!newLine){
            return
        }
        let name = e.target.name()
        let ifOnPoint = name.indexOf('Point') == -1
        if (ifOnPoint || curPointMouseUpName===name) {
            linesRef.current.destroy()
            setLineArr(lineArr.filter((v,i) => i !== lineArr.length - 1))
            setNewLine(null)
        } else {
            setNewLine(null)
        }
        
    }
    // 圆点鼠标抬起事件
    const handleUpPoint = (e: any) => {
        entityDraggableSetting(e, true)
    }
    // 圆点点击事件
    const handleClickPoint = (e: any) => {
    }
    const classes = useStyles();
        useImperativeHandle(ref, () => ({
            createPlant,
            editPlant,
            createDTY,
            saveCanvas,
            importCanvas
        }));
    
    return (
        <div className={classes.convasContainer} id='canvas-container'>
            <Stage
                {...stageXY}
                draggable
                width={cWidth} 
                height={cHeight} 
                ref={stageRef}
                onMouseMove={(e) => handleMoveLine(e)}
                onMouseUp={(e) => handleUpStage(e)}
                onDragEnd={(e) => hanleStageDragEnd(e)}
                >
                <Layer >
                    {!plantIfCreated ? null:
                        <Group
                            id='plantId'
                            {...plantGroupArg}
                            
                        >
                            <Rect
                                name='pEditRect'
                                stroke='black'
                                strokeWidth={1}
                                {...plantEidtRectArg}
                            >

                            </Rect>
                            <Text 
                                name='pEditTexts'
                                text='EDIT'
                                fontSize={16}
                                fontFamily='Calibri'
                                fill='black'
                                verticalAlign='middle'
                                align='center'
                                {...plantEidtTextArg}
                                onMouseEnter={handMouseEnterStyle}
                                onMouseLeave={handMouseLeaverStyle}
                                onClick={() => {plantClick(plantPropertyData)}}
                            ></Text>
                            <Line
                                stroke='black'
                                strokeWidth={1}
                                lineCap='round'
                                lineJoin='round'
                                {...plantLineBorderArg}
                            ></Line>
                        {DTYArr.map((v, i) =>{
                            return(
                                <Group key={i} {...v.DTYGroupArg}>
                                    <Text {...v.DTYText}></Text>
                                    <Rect {...v.DTYRect} 
                                        onDblClick={(e) => handleDTYDblClick(v.data, e)}
                                        onClick={(e) => handleDTYClick(e)}
                                    ></Rect>
                                    {v.pointsList.map((pv: any) => <Circle 
                                        key={pv.name} 
                                        {...pv}
                                        onClick={(e) => handleClickPoint(e)}
                                        onMouseEnter={(e) => handleEnterPoint(e)}
                                        onMouseLeave={(e) => handleLeavePoint(e)}
                                        onMouseDown = {(e) => handleDownPoint(e)}
                                        onMouseUp = {(e) => handleUpPoint(e)}
                                    ></Circle>)}
                                </Group>   
                            )
                        })}
                    </Group>
                    }
                </Layer>
                <Layer>{lineArr}</Layer>
            </Stage>
        </div>    
    )
}) 


