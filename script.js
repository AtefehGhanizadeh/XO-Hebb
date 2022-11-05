
const items=document.querySelectorAll('.grid-item')
const saveBtn=document.querySelector('#saveBtn')
const form=document.querySelector('form')
const radioBtn=document.getElementsByName('check')
const predictBtn=document.querySelector("#PredictBtn")

let datasetArray=[]
let data={}
let weights=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
let bias=0;


items.forEach(item=>item.addEventListener('click',()=>{

    ((item.dataset.value)==="-1")?(item.style.backgroundColor='black',item.dataset.value="1"):(item.style.backgroundColor='rgb(219, 211, 255)',item.dataset.value="-1")

}))

//Creat Dataset


function saveData(e){
    e.preventDefault()
    //Recognize vector's label
    let tlabel=`${(radioBtn[0].checked)?'X':(radioBtn[1].checked)?'O':'none'}`;
    //Recognize vector's y
    let ty=(tlabel==='X')?1:(tlabel==='O')?-1:0
    //Create vector
    data={
    xArray:[items[0].dataset.value,items[1].dataset.value,items[2].dataset.value,items[3].dataset.value,
    items[4].dataset.value,items[5].dataset.value,items[6].dataset.value,items[7].dataset.value,
    items[8].dataset.value,items[9].dataset.value,items[10].dataset.value,items[11].dataset.value,
    items[12].dataset.value,items[13].dataset.value,items[14].dataset.value,items[15].dataset.value,
    items[16].dataset.value,items[17].dataset.value,items[18].dataset.value,items[19].dataset.value,
    items[20].dataset.value,items[21].dataset.value,items[22].dataset.value,items[23].dataset.value,items[24].dataset.value]
    ,y:ty,label:tlabel}
    
    //Put vector in dataset
    axios.post("http://localhost:3000/vectors",data).then().catch(err=>console.log(err))
}

form.addEventListener('submit',saveData)

//Training
function calculateWeights(){

    let i;
    let j;

    //Get dataset

    axios.get("http://localhost:3000/vectors").then(res=>{
        
    datasetArray=res.data

    for(i=0;i<datasetArray.length;i++){

        let dwArray=[]
        let db=datasetArray[i].y
        for(j=0;j<25;j++){
            dwArray[j]=(parseInt(datasetArray[i].xArray[j]))*parseInt(datasetArray[i].y)
            weights[j]=weights[j]+dwArray[j]
            bias=bias+db
            
        }
        
        
    }
})
     
}

//On Load

calculateWeights()


//Predict

//calculate y for specific vector

function calculateY(){

    let ty=0;
    let resault=0;

    for(i=0;i<25;i++){
        
        resault=resault+(items[i].dataset.value*weights[i])
        ty=resault+bias
    }

    return ty
}

function stepFunction(){

    const res=(calculateY()>=0)?1:-1
    return res
}

//Predict character

function predictChar(){
    stepFunction()===1?alert("The character is X"):alert("The character is O")
}


predictBtn.addEventListener("click",predictChar)


