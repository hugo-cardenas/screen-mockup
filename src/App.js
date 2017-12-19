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
    }

    render() {
        return <div className="root-container container">
            <h1 className="title">Screen to Shot</h1>
            <p className="subtitle">
                Screenshot -> Browser mockup
            </p>
            {this.renderFileInput()}
            <canvas id="canvas"></canvas>
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
                {img ? <img src={img} /> : null}  
            </div>
        </div>;
    }

    convertToCanvas() {
        const node = document.querySelector('.mockup-browser');
        const canvas = document.querySelector('#canvas');
        return html2canvas(node, { canvas, scale: 4 });
    }

    async handleFileInput(event) {
        try {
            const file = this.fileInput.files[0];
            const img = await getImageUrl(file);
            this.setState({ img }, () => {
                this.convertToCanvas().then(canvas => {
                    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
                    window.location.href = image;
                });
            });
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
