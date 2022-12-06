import {CanvaContainer} from './CanvaContainer'
import {
    Box,
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    makeStyles,
} from '@material-ui/core'
import { useState, useRef, useContext, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from './index';
// import { useToken } from '~/api/token'
// import {getModelTemplateEntities, getModelTemplateEntity} from '~/api/axios'



const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; }) => ({
    optionBtn: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    canvasBox:{
        border: '1px solid #46698C',
        height: '90%'
    }
}));

export default function Container() {
    const { control, handleSubmit, setValue } = useForm();
    // const { accessToken } = useToken()
    const {type, setType} = useContext(Context);
    const classes = useStyles();
    const convasRef = useRef(null);
    const [plantOpen, setPlantOpen] = useState(false);
    const [DTYOpen, setDTYOpen] = useState(false);
    const [copyDisable, setCopyDisable] = useState(true);
    const [copyData, setCopyData] = useState('');
    const [btnDisable, setBtnDisable] = useState(true);
    const [DTYProTemPros, setDTYProTemPros] = useState([]);
    const [plantProTemPros, setPlantProTemPros] = useState([]);
    const [plantLists, setPlantLists] = useState(null)
    const [DTYLists, setDTYLists] = useState(null)
    const [DTYProList, setDTYProList] = useState([])
    const [pProList, setPProList] = useState([])

    // 获取DTY和plant的ID以及获取plant和DTY的模板属性
    const getModleTempalteTypeAndPros = async () => {
        // const {data} = await getModelTemplateEntities({type:''}, accessToken)
        // const retObj = data?.retObj
        // let DTYProTemId = ''
        // let plantProTemId = '' 
        // for(let i = 0; i < retObj.length; i++){
        //     if(retObj[i].type == "DTY"){
        //         DTYProTemId = retObj[i].id
        //     }
        //     if(retObj[i].type == "Plant"){
        //         plantProTemId = retObj[i].id
        //     }
        // }
        // getModelTemplateEntity({id:plantProTemId}, accessToken).then(res => {
        //     setPlantProTemPros(res?.data?.retObj?.modelTemplatePropertyMappings)
        // })
        // getModelTemplateEntity({id:DTYProTemId}, accessToken).then(res => {
        //     setDTYProTemPros(res?.data?.retObj?.modelTemplatePropertyMappings)
        // })
        let DTYdata = require('./DTYdata.json')?.modelTemplatePropertyMappings
        let pdata = require('./Pdata.json')?.modelTemplatePropertyMappings
        setDTYProTemPros(DTYdata)
        setPlantProTemPros(pdata)
    }
    useEffect(() => {
        getModleTempalteTypeAndPros()
    },[])

    useEffect(() => {
        createPlantLists(plantProTemPros)
        createDTYLists(DTYProTemPros)
    },[DTYProTemPros, plantProTemPros])
    const setDefaultOrEditValue = (DTYTempProList: any) => {
        DTYTempProList.forEach( (v:any) => {
            setValue(v.name, v.value)
        });
        
    }
    const createPlantLists = (plantProTemProsLists: any) => {
        let pTempProList:any = []
        const result = plantProTemProsLists?.map( (v : any) => {
            const {modelTemplateProperty} = v
            pTempProList.push({
                name: modelTemplateProperty.name,
                value: modelTemplateProperty.defaultValue
            })
            return (
            <Controller
                key={v.propertyId}
                name={modelTemplateProperty.name}
                control={control}
                defaultValue={modelTemplateProperty.defaultValue}
                render={
                    ({ field }) => 
                    <TextField
                        type="number"
                        autoComplete="off"
                        id={v.propertyId}
                        margin="dense" 
                        fullWidth
                        label={`plant ${modelTemplateProperty.name}`}
                        {...field} 
                    />}
            />)  
        })
        setPProList(pTempProList)
        setPlantLists(result)
        
    }
    const createDTYLists = (DTYProTemProsLists: any) => {
        let DTYTempProList: any = []
        const result: any = DTYProTemProsLists?.map( (v : any) => {
            const {modelTemplateProperty} = v
            DTYTempProList.push({
                name: modelTemplateProperty.name,
                value: modelTemplateProperty.defaultValue
            })
            return (
            <Controller
                key={v.propertyId}
                name={modelTemplateProperty.name}
                control={control}
                // defaultValue={modelTemplateProperty.defaultValue}
                render={
                    ({ field }) => 
                    <TextField
                        autoComplete="off"
                        id={v.propertyId}
                        margin="dense" 
                        fullWidth
                        label={`DTY ${modelTemplateProperty.name}`}
                        {...field} 
                    />}
            />)  
        })
        // setValue("Length", "Hopper", {
        //     shouldValidate: true,
        //     shouldDirty: true
        //   });
        setDTYProList(DTYTempProList)
        setDTYLists(result) 
    }
    
    const setPlantArg = (data: any) => {
       
        if(convasRef.current){
            console.log('data', data);
            (convasRef.current as any).createPlant(data)
        }
        setPlantOpen(false);
        if(btnDisable){
            setBtnDisable(false)
        }
    }
    const cancleCreatePlant = () => {
        setPlantOpen(false);
    }
    const setDTYArg = (data: any) => {
        setCopyData(data)
        if(convasRef.current){
            console.log('dtydata', data);
            (convasRef.current as any).createDTY(data)
            setType('create')
            setDTYOpen(false);
            if(copyDisable){
                setCopyDisable(false)
            }
        }        
    } 
    const copyHanedle = () => {
        if(convasRef.current){
            (convasRef.current as any).createDTY(copyData)
        } 
    }
    const cancleCreateDTY = () => {
        setType('create')
        setDTYOpen(false);
    }
    const saveHanedle = () => {
        if(convasRef.current){
            (convasRef.current as any).saveCanvas()
        }    
    }
    const importHanedle = () => {
        if(convasRef.current){
            (convasRef.current as any).importCanvas()
        }    
    }

    const handleCanvasClick = (data: any) => {
        console.log('handleCanvasClick', data)
        setDTYOpen(true)
        createDTYLists(DTYProTemPros)
    }
    const hanelePlantOpen = () => {
        setDefaultOrEditValue(pProList)
        setPlantOpen(true)
    }
    const haneleDTYOpen = () => {
        setDefaultOrEditValue(DTYProList)
        setDTYOpen(true)
    }
    return (
        <div style={{height:'99vh'}}>
            <Box className={classes.optionBtn}>
                <Button variant="contained" onClick={() => hanelePlantOpen()}>Plant</Button> 
                <Button disabled={btnDisable} variant="contained" onClick={() =>  haneleDTYOpen()}>DTY</Button>
                <Button disabled={btnDisable} variant="contained" onClick={() => saveHanedle()}>save</Button>
                <Button variant="contained" onClick={() => importHanedle()}>import</Button>
                <Button disabled={copyDisable} variant="contained" onClick={() => copyHanedle()}>copy</Button>
            </Box>
            <Box className={classes.canvasBox}>
                
                <CanvaContainer canvasClick={(data: any) => handleCanvasClick(data)}  ref={convasRef}/>
            </Box>
            <Dialog open={plantOpen} onClose={cancleCreatePlant} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Plant Setting</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Please set the width and height of plant, then a plant will be created
                </DialogContentText>
                    {plantLists}
                </DialogContent>
                <DialogActions>
                <Button onClick={cancleCreatePlant} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit(setPlantArg)} color="primary">
                    Create
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={DTYOpen} onClose={cancleCreateDTY} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">DTY Setting</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please set Various parameters of DTY, then DTY will be {type=='created' ? 'Create': 'Edited'}
                    </DialogContentText>
                    {DTYLists}
                </DialogContent>
                <DialogActions>
                <Button onClick={cancleCreateDTY} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit(setDTYArg)} color="primary">
                    {type=='create' ? 'Create': 'Edit'}
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
