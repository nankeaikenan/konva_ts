import {CanvaContainer} from './CanvaContainer'
import {
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    makeStyles,
} from '@material-ui/core'
import { SetStateAction, useState, useRef, useContext } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from './index';


const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; }) => ({
    optionBtn: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    canvasBox:{
        border: '1px solid blue',
        height: '90%'
    }
}));

export default function Container() {
    const {type, setType} = useContext(Context);

    const classes = useStyles();

    const convasRef = useRef(null);
    
    const [plantOpen, setPlantOpen] = useState(false);
    const [DTYOpen, setDTYOpen] = useState(false);
    const [copyDisable, setCopyDisable] = useState(true);
    const [copyData, setCopyData] = useState('');
    const [btnDisable, setBtnDisable] = useState(true);

    
    // type DTYx = 'width'|'height'|'topDS'|'leftDS'
    let DTYArgs = ['width','height','topDS','leftDS']
    let plantArgs = ['width','height']
 
    const { control, handleSubmit } = useForm();
    const plantLists = plantArgs.map((v,index) => {
        return (
        <Controller
            key={v}
            name={v as any}
            control={control}
            defaultValue=''
            render={
                ({ field }) => 
                <TextField
                    id={v}
                    margin="dense" 
                    fullWidth
                    label={`plant ${v}(meter)`}
                    {...field} 
                />}
        />)  
    })
    const DTYLists = DTYArgs.map((v,index) => {
        return (
        <Controller
            key={v}
            name={v as any}
            control={control}
            defaultValue=''
            render={
                ({ field }) => 
                <TextField
                    id={v}
                    margin="dense" 
                    fullWidth
                    label={`DTY ${v}(meter)`}
                    {...field} 
                />}
        />)  
    })
    const setPlantArg = (data: any) => {
        if(convasRef.current){
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
        console.log(1, data)
        setCopyData(data)
        if(convasRef.current){
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

    const handleCanvasClick = () => {
        setDTYOpen(true)
    }
    return (
        <div style={{height:'99vh', border: '2px solid green'}}>
            <div className={classes.optionBtn}>
                <Button variant="contained" onClick={() => setPlantOpen(true)}>Plant</Button> 
                <Button disabled={btnDisable} variant="contained" onClick={() => setDTYOpen(true)}>DTY</Button>
                <Button disabled={btnDisable} variant="contained" onClick={() => saveHanedle()}>save</Button>
                <Button variant="contained" onClick={() => importHanedle()}>import</Button>
                <Button disabled={copyDisable} variant="contained" onClick={() => copyHanedle()}>copy</Button>
                {/* <Button variant="contained" onClick={() => test()}>test</Button> */}

            </div>
            <div className={classes.canvasBox}>
                <CanvaContainer canvasClick={() => handleCanvasClick()}  ref={convasRef}/>
            </div>
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
