import {
    makeStyles,
} from '@material-ui/core'
import { useState,forwardRef, useContext, useRef} from 'react';
import {useImperativeHandle } from 'react';
import { Context } from './index';
import { Stage, Layer, Group, Rect, Text, Circle, Line } from 'react-konva';



const useStyles = makeStyles(() => ({
    convasContainer:{
        // border: '1px solid green',
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
// DTY数据反格式化
const dataDeformat = (data: any) => {
    
}
export const CanvaContainerRK = forwardRef((props: any, ref: any) => {
    let cWidth = document.getElementById('canvas-container')?.clientWidth
    let cHeight = document.getElementById('canvas-container')?.clientHeight
    const {type, setType, editRect, setEditRect} = useContext(Context);
    let { DTYClick, plantClick } = props;

    const [plantIfCreated, setPlantIfCreated] = useState(false)
    const [plantGroupArg, setPlantGroupArg] = useState({})
    const [plantLineBorderArg, setPlantLineBorderArg] = useState({})
    const [plantEidtRectArg, setPlantEidtRectArg] = useState({})
    const [plantEidtTextArg, setPlantEidtTextArg] = useState({})
    // 保存每次plant创建的值
    const [editStatusPlantData, setEditStatusPlantData] = useState({})
    // DTY数组
    const [DTYArr, setDTYArr] = useState<any[]>([])

    // 创建工厂
    const createPlant = (data: any) => {
        setPlantIfCreated(true)
        setEditStatusPlantData(data)
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
        setEditStatusPlantData(plantData)
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
        let DTYGroupArg = {
            name:'rectGroupName'+ DTYArr.length,
            width: DTYWidth,
            height: DTYHeight,
            draggable: true,
        }
        // DTY的矩形
        let DTYRect = {
            name: 'DTYRect'+DTYArr.length,
            width: DTYWidth,
            height: DTYHeight,
            stroke: 'black',
            // draggable: true,
            strokeWidth: 1
        }
        // DTY的文字
        let dataText = dataFormat(data)
        let DTYText = {
            name: 'DTYtext'+ DTYArr.length,
            text: dataText,
            width: DTYWidth,
            height: DTYHeight,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black',
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
            let pointArg = {
                ...pointXYs[i],
                name: v + DTYArr.length,
                fill:'red',
                stroke:'black',
                strokeWidth: 1,
                radius: 4,
            }
            return pointArg
        })
        let newDTY = <Group key={DTYArr.length} {...DTYGroupArg} >
                        <Text {...DTYText}></Text>
                        <Rect {...DTYRect} onClick={(e) => handleDTYClick(data, e)}></Rect>
                        {pointsList.map(v => <Circle 
                                                key={v.name} 
                                                {...v}
                                                onClick={(e) => handleClickPoint(e)}
                                                onMouseEnter={(e) => handleEnterPoint(e)}
                                                onMouseLeave={(e) => handleLeavePoint(e)}
                                                onMouseDown = {(e) => handleDownPoint(e)}
                                                onMouseUp = {(e) => handleUpPoint(e)}
                                            ></Circle>)}
                      </Group>   
        setDTYArr([...DTYArr,  newDTY])
    }
    // DTY点击编辑
    const handleDTYClick = (data:any, e:any) => {
        setType('edit')
        setEditRect(e.target)
        DTYClick(data)
    }
    // 编辑DTY
    const editDTY = (data: any) => {
        // // DTY大小编辑
        let {Length : DTYWidth, Width : DTYHeight} = data
        DTYWidth = Number(DTYWidth)
        DTYHeight = Number(DTYHeight)
        editRect.width(DTYWidth)
        editRect.height(DTYHeight)
        let reatParentGroup = editRect.parent
        // group,rect,text的尾数一致
        let textName = '.DTYtext' + reatParentGroup.name().match(/\d+/g).join('')
        let textNode = reatParentGroup.findOne(textName)
        const dataText = dataFormat(data)
        textNode.text(dataText)
        editRect.off('click');
        editRect.on('click',(e: any) => handleDTYClick(data, e))
    }

    // 统一处理鼠标事件中点的parent和grandparent node的拖拽属性
    const entityDraggableSetting = (e: Event & { target: Element }, status: boolean) => {
        let pointEntityParentGroup = (e.target as any).parent
        let plantEntityGroup = pointEntityParentGroup.parent
        pointEntityParentGroup.draggable(status)
        plantEntityGroup.draggable(status)
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
        console.log(11)
        entityDraggableSetting(e, false)
    }
    // 鼠标抬起事件
    const handleUpPoint = (e: any) => {
        console.log(222)
        entityDraggableSetting(e, true)
    }
    // 圆点点击事件
    const handleClickPoint = (e: any) => {
        let pointEntity = e.target
        // let pointEntityParentGroup = e.target.parent
        // pointEntityParentGroup.draggable(true)
        console.log(e.target)

    }
    const classes = useStyles();
        useImperativeHandle(ref, () => ({
            createPlant,
            editPlant,
            createDTY,
            editDTY
        }));
    return (
        <div className={classes.convasContainer} id='canvas-container'>
            <Stage width={cWidth} height={cHeight}>
                <Layer>
                    {!plantIfCreated ? null:
                        <Group
                            id='plantId'
                            draggable
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
                                onClick={() => {plantClick(editStatusPlantData)}}
                            ></Text>
                            <Line
                                stroke='black'
                                strokeWidth={1}
                                lineCap='round'
                                lineJoin='round'
                                {...plantLineBorderArg}
                            ></Line>
                        {DTYArr}
                    </Group>
                    }
                </Layer>
            </Stage>
        </div>
        
    )
}) 


