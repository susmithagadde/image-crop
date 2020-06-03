import React, { Component } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import './Crop.css';


// const rotatableOptions = {
//     crop: function(e) {
//         var data = e.detail;
//         const dataRotate = document.getElementById('dataRotate');
//         dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
       
//       }
// }

class Crop extends Component {
    constructor(props){
        super(props);
        this.state = {
           cropper: '',
           range: 0,
           extractedData:[],
           loading: false,
        }
    }

    onUpload = (e) => {
        let result = document.querySelector('.result');
        let save = document.querySelector('.save');
        let options = document.querySelector('.options');
        let left = document.querySelector('.left');
        let right = document.querySelector('.right');
        let add = document.querySelector('.add');
        let minus = document.querySelector('.minus');
        if (e.target.files.length) {
            // start file reader
        const reader = new FileReader();
        reader.onload = (e)=> {
          if(e.target.result){

                     
                    // create new image
                    let img = document.createElement('img');
                    img.id = 'image';
                    img.src = e.target.result
                    // clean result before
                    if(result !== null){
                        result.innerHTML = '';
                    }
                    // append new image
                     result.appendChild(img);
                    // show save btn and options
                    save.classList.remove('hide');
                    options.classList.remove('hide');
                    left.classList.remove('hide');
                    right.classList.remove('hide');
                    add.classList.remove('hide');
                    minus.classList.remove('hide');
                    // init cropper
                    this.setState({cropper: new Cropper(img, {background: false})});
                    //cropper = new Cropper(img);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } 

    onSave = (e) => {
        const { cropper } = this.state;
        let img_result = document.querySelector('.img-result');
        let img_w = document.querySelector('.img-w');
        let cropped = document.querySelector('.cropped');
        
        // let dwn = document.querySelector('.download');
        e.preventDefault();
        // get result to data uri
        let imgSrc = cropper.getCroppedCanvas({
              width: img_w.value // input value
          }).toDataURL('image/jpeg');
        // remove hide class of img
        cropped.classList.remove('hide');
          img_result.classList.remove('hide');
          // show image cropped
        cropped.src = imgSrc;

        let strImage = imgSrc.replace(/^data:image\/[a-z]+;base64,/, "");
       
        // Fetching Details from Pan card
        this.setState({ loading: true });
        let requestOptions = {
            method: 'POST',
             headers: { "Access-Control-Allow-Origin": "https://u90x12pc4c.execute-api.ap-south-1.amazonaws.com/ocr"},
              body: JSON.stringify({ image64: strImage })   
        }
                
        

        fetch('https://cors-anywhere.herokuapp.com/https://u90x12pc4c.execute-api.ap-south-1.amazonaws.com/ocr', requestOptions)
        .then(res => res.json())
        .then(response => {
            this.setState({extractedData: response, loading: false})
        })
    }

    onRotateLeft = () => {
        const { cropper } = this.state;
        cropper.rotate(90);
       
        
    }

    onRotateRight = () => {
        const { cropper } = this.state;
        cropper.rotate(-90);
        const containerData = cropper.getContainerData();
        const CanvasData = cropper.getCanvasData();
        const imageData = cropper.getImageData();
         imageData.width = containerData.width;
        imageData.height= containerData.height;
        
        cropper.setCropBoxData({top: CanvasData.top+50,left: CanvasData.left+ 50,width:containerData.width/2, height: containerData.height / 2});
        
    }

    onRotateOne = () => {
        const { cropper } = this.state;
        cropper.rotate(1);
    }

    rotateOne = (val, text) => {
        const { cropper } = this.state;
         text === 'plus' ? cropper.rotate(val) : cropper.rotate(-val);
        
    }

      updateRange(e) {
      const { cropper, range } = this.state;
      
       cropper.rotate(-(range - e.target.value));
      document.getElementById('output').innerHTML=e.target.value + "deg";
       
           this.setState({
               range: e.target.value
             })
      } 

      onRotateAdd = () => {
        const { cropper } = this.state;
        cropper.rotate(1);
      }

      onRotateMinus = () => {
        const { cropper } = this.state;
        cropper.rotate(-1);
      }


      updateRange11 = (e) => {
          let value = e.target.value;
        document.getElementById('div1').style.webkitTransform="rotate(" + value + "deg)";
        document.getElementById('div1').style.msTransform="rotate(" + value + "deg)";
        document.getElementById('div1').style.MozTransform="rotate(" + value + "deg)";
        document.getElementById('div1').style.OTransform="rotate(" + value + "deg)";
        document.getElementById('div1').style.transform="rotate(" + value + "deg)";
      }
  

    render() {
    
    const { range, extractedData, loading } = this.state;
        return(
            <section>
             <h2>Upload ,Crop and save.</h2>

                <div className="box">
                    <input type="file" id="file-input" onChange={this.onUpload} />
                </div>

                <div className="box-2">
                    <div className="result"></div>
                </div>

                <div className="box">
                    <div className="options hide">
                           <div className="div">
                                <input id="range" type="range"
                                value={range}
                                min="-360"
                                max="360"
                                step="1"
                                onChange={(e) => this.updateRange(e)}
                                />
                                <span id="output">{range}</span>
                            </div>
                         <label> Width</label>
                        <input type="number" className="img-w" value="300" min="100" max="1200"  /> 
                    </div>
                    <button className="btn add hide" onClick={this.onRotateLeft}>90-Left</button>
                    <button className="btn minus hide" onClick={this.onRotateRight}>90-Right</button>
                    <button className="btn left hide" onClick={this.onRotateAdd}>+</button>
                    <button className="btn right hide" onClick={this.onRotateMinus}>-</button>
                    {/* <button className="one" onClick={this.onRotateOne}>one</button> */}
                    <button className="btn save hide" onClick={this.onSave}>Save</button>

                    {/* <div id="div1">HELLO</div>
                    <div className="div">
                                <input id="range1" type="range"
                                value={range}
                                min="0"
                                max="45"
                                step="1"
                                onChange={(e) => this.updateRange11(e)}
                                />
                                <span id="output">{range}</span>
                            </div> */}
                 
                    {/* <a href="" className="btn download hide">Download</a> */}
                </div>

                <div className="box-2 img-result hide">
                    <img className="cropped" src="" alt="" />
                </div>
                {loading && <div className="loader4"></div>}
                {extractedData.length !== 0 && !loading &&
                <div className="cards-list">
  
                <div className="card 1">
                    <div className="card_title title-white">
                            <p>Name: <span>{extractedData.name}</span></p>
                            <p>Father Name: <span>{extractedData.father_name}</span></p>
                            <p>dob: <span>{extractedData.dob}</span></p>
                            <p>pan: <span>{extractedData.pan}</span></p>
                    </div>
                </div>
            </div>}
                
                
            </section>
        )
    }
}

export default Crop;