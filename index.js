//load transformers.js
//pipeline is API by transformer library - which we can use to do tasks
import { pipeline,env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

//skip local model check
env.allowLocalModels = false;

//read DOM elements
const fileUpload = document.getElementById("file-upload")
const imageContainer = document.getElementById("image-container")
const status = document.getElementById("status")

status.textContent = 'Loading Model...'

//for now we will be doing this in the main thread
//ideally in production apps - we have to use web workers for multi threaded
//so that the UI won't freeze
//pipeline accepts task and model
const detector = await pipeline("object-detection","Xenova/detr-resnet-50")

//after it is loaded
status.textContent = 'Ready'

//wait for file upload
fileUpload.addEventListener("change",(event)=>{
    //file object
    const file = event.target.files[0]

    if(!file){
        return
    }

    //use file reader API
    const reader = new FileReader()

    //we need a call back function after file is read
    reader.onload = (e)=>{
        //clear the image
        imageContainer.innerHTML = ""
        //create
        const image = document.createElement("img")
        image.src = e.target.result //this will be the file url after it is read
        imageContainer.appendChild(image)

        //TODO-detect image
        detect(image)
    }

    //read file
    reader.readAsDataURL(file)

})

const detect = async (image) => {
    status.textContent = 'Analysing...'
    //call detector
    const output = await detector(image.src,{
        threshold : 0.5,//confidence level , the lower the level more objects it will 
        //identify, but can go wrong, the higher the level it will identify less but more accurate
        percentage : true //give the bounding box cordinates as percentages - so that
        //we can frame the objects
    })
    status.textContent = ''
    //this will be an array of objects
    //this will have bounding box coordinates
    console.log("output",output)

    output.forEach(element => {
        renderBox(element)
    });
}

//we need to add a box and show label on the objects deted
const renderBox = ({box,label})=>{
    //read cordinates
    const {xmax,xmin,ymax,ymin} = box

    //color for the box - hex value
    const color = "#" +  Math.floor(Math.random()* 0xffffff).toString(16).padStart(6,0)

    //draw box
    const boxElement = document.createElement("div")
    boxElement.className = "bounding-box"


    //this function renderbox will be called for each object in the output array
    //so for each object add this box
    Object.assign(boxElement.style, {
        borderColor : color,
        left : 100*xmin + "%",
        top : 100*ymin + "%",
        width : 100*(xmax-xmin)+"%",
        height : 100*(ymax-ymin)+"%"
    })

    //draw label
    const labelElement = document.createElement("span")
    labelElement.textContent = label
    labelElement.className = "bounding-box-label"
    labelElement.style.backgroundColor = color

    //add label to box
    boxElement.appendChild(labelElement)
    //add box
    imageContainer.appendChild(boxElement)
}

