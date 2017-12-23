import React, { Component } from 'react';
import domToImage from 'dom-to-image';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import './style/App.styl';
import 'bulma/css/bulma.css';

class App extends Component {
    constructor() {
        super();
        this.state = {};
        this.fileInput = null;
        this.mockup = null;

        this.fileInputRef = this.fileInputRef.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
    }

    render() {
        return <div className="root-container container">
            <h1 className="title">Screen Mockup</h1>
            <p className="subtitle">
                Screenshot -> Browser mockup
            </p>
            {this.renderFileInput()}
            {this.renderBrowserMockup()}
            <div>
                <a className="button" onClick={() => this.handleDownload()}>Download</a>
            </div>
        </div>
    }

    renderFileInput() {
        return <div className="file file-form">
            <label className="file-label">
                <input 
                    className="file-input" 
                    type="file" 
                    onChange={this.handleFileInput}
                    ref={ref => this.fileInput = ref}
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

    renderBrowserMockup()  {
        const { img } = this.state;
        const style = {
            backgroundImage: `url(${img})`
        };
        return <div 
            className="mockup-browser"
            ref={ref => this.mockup = ref}>
            <div className="toolbar">
                <div className="toolbar-buttons">
                    <div className="toolbar-button button-close"></div>
                    <div className="toolbar-button button-minimize"></div>
                    <div className="toolbar-button button-maximize"></div>
                </div>
            </div>
            <div className="content">
                {img ? <img src={img} /> : null}  
            </div>
        </div>;
    }

    async handleDownload() {
        const node = document.querySelector('.mockup-browser');
        const canvas = await convertToCanvas(node);
        var dataURL = canvas.toDataURL('image/png');//.replace("image/png", "image/octet-stream"); 
        downloadImage(dataURL);
    }

    async handleFileInput(event) {
        try {
            const file = this.fileInput.files[0];
            const img = await getImageUrl(file);
            this.setState({ img });
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
};

const convertToCanvas = node => html2canvas(node, { scale: 4 });

const downloadImage = dataURL => {
    var link = document.createElement('a');
    link.download = 'mockup.png';
    link.href = dataURL;
    link.click();
};