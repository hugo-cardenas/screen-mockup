import React, { Component } from 'react';
import domToImage from 'dom-to-image';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import './style/App.styl';
import 'bulma/css/bulma.css';

class App extends Component {
    constructor() {
        super();
        this.fileInput = null;
        this.fileInputRef = this.fileInputRef.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);

        this.state = {};
        // this.state = {
        //     img: 'https://raw.githubusercontent.com/hugo-cardenas/movie-stats-web/master/readme/screenshot.png'
        // };
    }

    render() {
        return <div className="root-container container">
            <h1 className="title">Screen to Shot</h1>
            <p className="subtitle">
                Screenshot -> Browser mockup
            </p>
            {this.renderFileInput()}
            {this.renderBrowserMockup()}
        </div>
    }

    renderFileInput() {
        return <div className="file file-form">
            <label className="file-label">
                <input 
                    className="file-input" 
                    type="file" 
                    onChange={this.handleFileInput}
                    ref={this.fileInputRef}
                    />
                <span className="file-cta">
                    <span className="file-icon">
                        <i className="fa fa-upload"></i>
                    </span>
                    <span className="file-label">Upload an image...</span>
                </span>
            </label>
        </div>;
    }

    fileInputRef(ref) {
        this.fileInput = ref;
    }

    renderBrowserMockup()  {
        const { img } = this.state;
        const style = {
            backgroundImage: `url(${img})`
        };
        return <div className="mockup-browser">
            <div className="toolbar">
                <div className="toolbar-buttons">
                    <div className="toolbar-button button-close"></div>
                    <div className="toolbar-button button-minimize"></div>
                    <div className="toolbar-button button-maximize"></div>
                </div>
            </div>
            <div className="content">
                <div className="img" style={style}></div>
            </div>
        </div>;
    }

    async handleFileInput(event) {
        try {
            const file = this.fileInput.files[0];
            const img = await getImageUrl(file);
            this.setState({ img });
            return;
            const node = document.querySelector('.mockup-browser');



            var w = 1000;
            var h = 1000;
            var canvas = document.createElement('canvas');
            canvas.width = w*2;
            canvas.height = h*2;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            var context = canvas.getContext('2d');
            context.scale(2,2);
            html2canvas(node, { canvas: canvas, width: 320, height: 220}).then(function(canvas) {
                document.body.appendChild(canvas);
            });




            // html2canvas(node).then(function(canvas) {
            //     document.body.appendChild(canvas);
            // });

            // domToImage.toPng(node, { quality: 1 })
            // .then(function (dataUrl) {
            //     var img = new Image();
            //     img.src = dataUrl;
            //     document.body.appendChild(img);
            // })

            // domToImage.toBlob(node)
            //     .then(function (blob) {
            //         saveAs(blob, 'my-node.png');
            //     });
        } catch (error) {
            console.log(error);
            // this.setState({ error, status: STATUS_ERROR });
        }
    }


}

export default App;

const getImageUrl = async file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            return resolve(reader.result);
        };
        reader.onerror = reject;

        reader.readAsDataURL(file);
        
    });
}
