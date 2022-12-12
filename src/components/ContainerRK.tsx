import {CanvaContainerRK} from './CanvaContainerRK'
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
import { v4 as uuidv4 } from 'uuid';
// import { templatePropertyEntity, modelTemplatePropertyMappingsEntity } from '~/api/interfaces'

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

export default function ContainerRK() {
    const { control, handleSubmit, setValue } = useForm();
    // const { accessToken } = useToken()
    const {type, setType} = useContext(Context);
    const classes = useStyles();
    const convasRef: any = useRef(null);
    const [plantOpen, setPlantOpen] = useState(false);
    const [DTYOpen, setDTYOpen] = useState(false);
    const [copyDisable, setCopyDisable] = useState(true);
    const [copyData, setCopyData] = useState({});
    const [btnDisable, setBtnDisable] = useState(true);
    const [DTYProTem, setDTYProTem] = useState({});
    const [plantProTem, setPlantProTem] = useState({});
    const [DTYProTemPros, setDTYProTemPros] = useState([]);
    const [plantProTemPros, setPlantProTemPros] = useState([]);
    const [plantLists, setPlantLists] = useState(null)
    const [DTYLists, setDTYLists] = useState(null)
    // 创建以及编辑的回显
    const [DTYProList, setDTYProList] = useState([])
    const [pProList, setPProList] = useState([])
    // 工厂状态（创建/编辑）
    let [plantStatus, setPlantStatus] = useState('plantCreate')
    let copyCount = 0
    const [DTYPreName, setDTYPreName] = useState('')
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
        let modelTemplateProperty:any = {
            id: 0,
            propertyId: uuidv4(),
            templateId: uuidv4(),
            modelTemplateProperty: {
                defaultValue: "name",
                description: "Name",
                enable: true,
                id: uuidv4(),
                isSystemProperty: true,
                name: "Name" 
            }    
        }
        // getModelTemplateEntity({id:plantProTemId}, accessToken).then(res => {
        //     setPlantProTem(res?.data?.retObj)
        //     // 增加Name属性  
        //     res?.data?.retObj?.modelTemplatePropertyMappings?.unshift(modelTemplateProperty)
        //     setPlantProTemPros(res?.data?.retObj?.modelTemplatePropertyMappings)
        // })
        // getModelTemplateEntity({id:DTYProTemId}, accessToken).then(res => {
        //     setDTYProTem(res?.data?.retObj)
        //     res?.data?.retObj?.modelTemplatePropertyMappings?.unshift(modelTemplateProperty)
        //     setDTYProTemPros(res?.data?.retObj?.modelTemplatePropertyMappings)
        // })
        
        let pdata = require('./PlantData.json')
        setPlantProTem(pdata?.retObj)
        pdata?.retObj?.modelTemplatePropertyMappings?.unshift(modelTemplateProperty)
        setPlantProTemPros(pdata?.retObj?.modelTemplatePropertyMappings)

        let DTYdata = require('./DTYdata.json')
        setDTYProTem(DTYdata?.retObj)
        DTYdata?.retObj?.modelTemplatePropertyMappings?.unshift(modelTemplateProperty)
        setDTYProTemPros(DTYdata?.retObj?.modelTemplatePropertyMappings)
        console.log(DTYdata)
        
    }
    useEffect(() => {
        getModleTempalteTypeAndPros()
    },[])

    useEffect(() => {
        createPlantLists(plantProTemPros)
        createDTYLists(DTYProTemPros)
    },[DTYProTemPros, plantProTemPros])

    const createPlantLists = (plantProTemProsLists:any) => {
        let pTempProList:any = []
        const result = plantProTemProsLists.map( (v:any)=> {
            const {modelTemplateProperty} = v
            pTempProList.push({
                name: modelTemplateProperty?.name,
                value: modelTemplateProperty?.defaultValue
            }) 
            let isNumber =  modelTemplateProperty.name === 'Length' ||  modelTemplateProperty.name == 'Width' ? 'number' : ''
            let isRequired = modelTemplateProperty.name === 'Name' ||modelTemplateProperty.name === 'Length' ||  modelTemplateProperty.name == 'Width'
            return (
                <Controller
                    key={v.propertyId}
                    name={modelTemplateProperty.name}
                    control={control}
                    defaultValue={modelTemplateProperty.defaultValue}
                    render={
                        ({ field }) => 
                        <TextField
                            required={isRequired}
                            type={isNumber}
                            id={v.propertyId}
                            margin="dense" 
                            fullWidth
                            label={`plant ${modelTemplateProperty.name}`}
                            {...field} 
                        />}
                />)  
        })
        // 新建都用默认值
        setPProList(pTempProList)
        setPlantLists(result)
    }
    const createDTYLists = (DTYProTemProsLists:any) => {
        let DTYTempProList: any = []
        const result = DTYProTemProsLists.map( (v:any) => {
            const {modelTemplateProperty} = v
            DTYTempProList.push({
                name: modelTemplateProperty.name,
                value: modelTemplateProperty.defaultValue
            })
            let isNumber =  modelTemplateProperty.name === 'Length' ||  modelTemplateProperty.name == 'Width' ? 'number' : ''
            return (
            <Controller
                key={v.propertyId}
                name={modelTemplateProperty.name}
                control={control}
                defaultValue={modelTemplateProperty.defaultValue}
                render={
                    ({ field }) => 
                    <TextField
                        type={isNumber}
                        required
                        id={v.propertyId}
                        margin="dense" 
                        fullWidth
                        label={`DTY ${modelTemplateProperty.name}`}
                        {...field} 
                    />}
            />)  
        })
        setDTYProList(DTYTempProList)
        setDTYLists(result)
    }
    
    const setPlantArg = (data: any) => {
        if(data.Length === '0' || data.Width === '0'){
            setPlantOpen(false);
            return
        }
        if(convasRef.current){
            if(plantStatus === 'plantCreate'){
                convasRef.current?.createPlant(data)
            }else{
                convasRef.current?.editPlant(data)
            }   
        }
        setPlantStatus('plantCretate')
        setPlantOpen(false);
        if(btnDisable){
            setBtnDisable(false)
        }
    }
    const cancleCreatePlant = () => {
        setPlantOpen(false);
    }
    const setDTYArg = (data: any) => {
        if(data.Length === '0' || data.Width === '0'){
            setDTYOpen(false);
            return
        }
        copyCount = 0
        setDTYPreName(data.Name)
        setCopyData({
            ...data,
            Name: data.Name + 'copy'
        })
        if(convasRef.current){
            // if(type === 'create'){
            //     convasRef.current?.createDTY(data)
            // }else{
            //     convasRef.current?.editDTY(data)
            // }
            // setType('create')
            convasRef.current?.createDTY(data)
            setDTYOpen(false);
            if(copyDisable){
                setCopyDisable(false)
            }
        }        
    } 
    const copyHanedle = () => {
        if(convasRef.current){
            let copydata = Object.assign(copyData,{Name:`${DTYPreName}(copy${++copyCount})`})
            setCopyData(copydata)
            convasRef.current?.createDTY(copyData)
        } 
    }
    const cancleCreateDTY = () => {
        // setType('create')
        setDTYOpen(false);
    }
    const saveHanedle = () => {
        if(convasRef.current){
            convasRef.current?.saveCanvas()
        }    
    }
    const importHanedle = () => {
        if(convasRef.current){
            convasRef.current?.importCanvas()
        }    
    }
    const setDefaultOrEditValue = (DTYTempProList: any) => {
        DTYTempProList.forEach( (v:any) => {
            setValue(v.name, v.value)
        });
    }
    // 工厂编辑回调
    const handlePlantClick = (plantValues:any) => {
        for(let v of Object.entries(plantValues)){
            setValue(v[0], v[1])
        }
        setPlantStatus('plantEdit')
        setPlantOpen(true)
    }

    const handleCanvasClick = (editValue:any) => {
        for(let v of Object.entries(editValue)){
            setValue(v[0], v[1])
        }
        setDTYOpen(true)
    }
    const hanelePlantOpen = () => {
        setPlantStatus('plantCreate')
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
                <Button disabled={btnDisable} variant="contained" onClick={() => haneleDTYOpen()}>DTY</Button>
                <Button disabled={btnDisable} variant="contained" onClick={() => saveHanedle()}>save</Button>
                <Button variant="contained" onClick={() => importHanedle()}>import</Button>
                <Button disabled={copyDisable} variant="contained" onClick={() => copyHanedle()}>copy</Button>
            </Box>
            <Box className={classes.canvasBox}>
                <CanvaContainerRK
                    DTYProTem={DTYProTem}
                    plantProTem={plantProTem}
                    setBtnDisable={(status: boolean) => setBtnDisable(status)}
                    DTYClick={(data:any) => handleCanvasClick(data)}
                    plantClick = { (data:any) => handlePlantClick(data)}
                    ref={convasRef}/>
            </Box>
            <Dialog open={plantOpen} onClose={cancleCreatePlant} aria-labelledby="form-dialog-title">
                <form onSubmit={handleSubmit(setPlantArg)}>
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
                    <Button type='submit' color="primary">
                        {plantStatus === 'plantCreate' ? 'create' : 'edit'}
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={DTYOpen} onClose={cancleCreateDTY} aria-labelledby="form-dialog-title">
                <form onSubmit={handleSubmit(setDTYArg)}>
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
                    <Button type='submit' color="primary">
                        {type=='create' ? 'Create': 'Edit'}
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
