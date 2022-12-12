import { useEffect, useState } from 'react'

export const EventBugs = () => {

    const [count, setCount] = useState<any>(0)
    const [tagArr, setTagArr] = useState<any>([])
    let [arr, setArr] = useState<any>({x:0,y:0})

    const handleClicK = () => {
        console.log(count)
        setCount(count + 1)
    }
    const addcount = () => {
        console.log(count)
        setCount(count + 1)
    }
    const createTag = () => {
        console.log('createTag',tagArr.length,tagArr)
        let tags = <div key={createTag + tagArr.length}>
            <button  onClick={() => handleClicK()}>{"createTagBtn" + tagArr.length}</button>
        </div>
         setTagArr([...tagArr, tags])
    }
    const changeArr = () => {
        
        arr = {
            x:1,
            y:2
        }
        setArr(arr)
    }
    useEffect(() => {
        console.log('useEffect',count)
    }, [count])
    return (
        <div>
            <div>{arr.x}{arr.y}</div>
            <button onClick={() => changeArr()}>changeArr</button>
            <div>{count}</div>
            <button onClick={() => addcount()}>add</button>
            <br></br>
            <button onClick={() => createTag()}>createTag</button>
            <br></br>
            {tagArr}
        </div>

    )

    // const [count, setCount] = useState<any>(0)
    // const [tagArr, setTagArr] = useState<any>([])

    // const handleClicK = () => {
    //     console.log(count)
    //     setCount(count + 1)
    // }
    // const addcount = () => {
    //     console.log(count)
    //     setCount(count + 1)
    // }
    // const createTag = () => {
    //     console.log('createTag',tagArr.length,tagArr)
    //     let tags = 1
    //      setTagArr([...tagArr, tags])
    // }
    // useEffect(() => {
    //     console.log('useEffect',count)
    // }, [count])
    // return (
    //     <div>
    //         <div>{count}</div>
    //         <button onClick={() => addcount()}>add</button>
    //         <button onClick={() => createTag()}>createTag</button>    
    //         {tagArr.map((v: any,i: any) => {
    //             return (
    //                 <div key={createTag + i}>
    //                     <button  onClick={() => handleClicK()}>{"createTagBtn" + i}</button>
    //                 </div>
    //             )
    //         })}
    //     </div>

    // )
}
