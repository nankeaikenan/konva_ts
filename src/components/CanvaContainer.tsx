import {
    makeStyles,
} from '@material-ui/core'
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { forwardRef, useContext, useLayoutEffect } from 'react';
import { targetType,connectorsType } from '../interface/canvasContainer';
import React, { useRef, useState, useImperativeHandle } from 'react';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Context } from './index';

const useStyles = makeStyles(() => ({
    convasContainer:{
        border: '1px solid green',
        height: '100%'
    }
}));

let stage: Stage | null = null
let layer: Layer | null = null
let group: Group | Shape<ShapeConfig> | null = null

const dataFormat =(data: any) => {
    let dataString:string = ''
    for (let [key, value] of Object.entries(data)){
        // console.log(key, value)
        dataString += `${key}:${value}\n`
    }
    return dataString
}



const saveCanvas = () => {
    let canvasData = stage?.toJSON();
    localStorage.setItem('canvasData', canvasData as string);  
}

export const CanvaContainer = forwardRef((props: any, ref: any) => {
    const {type, setType, editRectGroup, setEditRectGroup} = useContext(Context);
    let { canvasClick } = props;
    
    const createPlant = (data: any) => {
        let {width, height} = data
        width = Number(width)
        height = Number(height)
        let Cwidth = document.getElementById('canvas-container')?.clientWidth
        let CHeight = document.getElementById('canvas-container')?.clientHeight
        stage = new Konva.Stage({
            container: 'canvas-container',
            width: Cwidth,
            height: CHeight,
            draggable: true,
        });
        layer = new Konva.Layer();
        // plant居中的坐标
        var gx =  ((Cwidth as any) - width)/2
        var gy = ((CHeight as any) - height)/2
        group = new Konva.Group({
            id:'plantId',
            x: gx,
            y: gy,
            width,
            height,
            draggable: true,
        });
        var borderLine = new Konva.Line({
          points: [0, 0, width, 0, width, height, 0, height, 0, 0],
          stroke: 'black',
          strokeWidth: 2    ,
          lineCap: 'round',
          lineJoin: 'round'
        });
        layer.add(group)
        group.add(borderLine)
        stage.add(layer);
        stage.on("wheel", (e) => {
            var max = 4;   // 放大最大的比例
            var min = 0.5; // 缩小最小的比例
            var step = 0.03; // 每次缩放的比例
         
            const x = e.evt.offsetX;
            const y = e.evt.offsetY;
         
            var offsetX = (x - (layer as any).offsetX()) * (layer as any).scaleX() / ((layer as any).scaleX() - step) - (x - (layer as any).offsetX());
            var offsetY = (y - (layer as any).offsetY()) * (layer as any).scaleY() / ((layer as any).scaleY() - step) - (y - (layer as any).offsetY());
            console.log(888,(layer as any).scaleY((layer as any).scaleY() + step) )
            if ((e.evt as any)?.wheelDelta) {
                if ((e.evt as any)?.wheelDelta > 0) { 
                    // 放大
                    if((layer as any).scaleX() < max && (layer as any).scaleY() < max){
                        (layer as any).scaleX((layer as any).scaleX() + step); 
                        (layer as any).scaleY((layer as any).scaleY() + step)
                        (layer as any).move({x:-offsetX, y:-offsetY}); // 跟随鼠标偏移位置
                    }
                } else {
                    // 缩小
                    if((layer as any).scaleX() > min && (layer as any).scaleY() > min){
                        (layer as any).scaleX((layer as any).scaleX() - step);
                        (layer as any).scaleY((layer as any).scaleY() - step);
                        (layer as any).move({x:offsetX, y:offsetY}); // 跟随鼠标偏移位置
                    }
                }
            }
        })
    }
    const createDTY = (data: any) => {
        let {width : DTYWidth, height : DTYHeight, leftDS,topDS} = data
        DTYWidth = Number(DTYWidth)
        DTYHeight = Number(DTYHeight)
        leftDS = Number(leftDS)
        topDS = Number(topDS)
        if(type === 'edit'){
            editRectGroup.destroy()
        }
        var rectGroup = new Konva.Group({
            name:'rectGroupName',
            x: leftDS,
            y: topDS,
            width: DTYWidth,
            height: DTYHeight,
            draggable: true,
        });
        (group as any).add(rectGroup)
        var rect = new Konva.Rect({
            x: leftDS,
            y: topDS,
            width: DTYWidth,
            height: DTYHeight,
            stroke: 'black',
            // draggable: true,
            strokeWidth: 1
        });
        (rectGroup as any).add(rect)
        rectGroup.on('click',(e)=>{
            setType('edit')
            setEditRectGroup(rectGroup)
            canvasClick()
        })
        
        const dataText = dataFormat(data)
        var textArgs = new Konva.Text({
            x: leftDS + 10,
            y: topDS + 10,
            text: dataText,
            fontSize: 15,
            fontFamily: 'Calibri',
            fill: 'black'
          });
          (rectGroup as any).add(textArgs);
        // var topLine = new Konva.Line({
        //     points: [leftDS + DTYWidth/2, topDS, leftDS + DTYWidth/2, 0],
        //     stroke: 'black',
        //     strokeWidth: 1,
    
        // });
        // (group as any).add(topLine)
        // var LeftLine = new Konva.Line({
        //     points: [0, topDS + DTYHeight/2, leftDS, topDS + DTYHeight/2],
        //     stroke: 'black',
        //     strokeWidth: 1,
        // });
        // (group as any).add(LeftLine)
        // console.log(666, rect.absolutePosition(), rect.position(),rect.offset())
    
    }
    const importCanvas = () => {
        if(localStorage.getItem('canvasData')){
            let canvasData = localStorage.getItem('canvasData')
            stage = Konva.Node.create(canvasData, 'canvas-container');
            group = (stage as any)?.findOne('#plantId')
            let rectGroups = (group as any).find('.rectGroupName')
            rectGroups.forEach((rectGroup: any) => {
                rectGroup.on('click',()=>{
                    setType('edit')
                    setEditRectGroup(rectGroup)
                    canvasClick()
                })
            });
        }else{
            alert('no data can be imported!')
        }
    }
    const classes = useStyles();
        useImperativeHandle(ref, () => ({
            createPlant,
            createDTY,
            saveCanvas,
            importCanvas
        }));
    return (
        <div id='canvas-container' className={classes.convasContainer}></div>
    )
}) 


