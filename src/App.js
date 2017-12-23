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
    }

    render() {
        return (
            <div className="root-container container">
                <h1 className="title">Screen Mockup</h1>
                <p className="subtitle">Screenshot -> Browser mockup</p>
                {this.renderFileInput()}
                {this.renderBrowserMockup()}
                {this.renderDownloadButton()}
            </div>
        );
    }

    renderFileInput() {
        return (
            <div className="file file-form">
                <label className="file-label">
                    <input
                        className="file-input"
                        type="file"
                        onChange={() => this.handleFileInput()}
                        ref={ref => (this.fileInput = ref)}
                    />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fa fa-upload" />
                        </span>
                        <span className="file-label">Upload an image...</span>
                    </span>
                </label>
            </div>
        );
    }

    renderBrowserMockup() {
        const { img } = this.state;
        const style = {
            backgroundImage: `url(${img})`
        };
        return (
            <div className="mockup-browser" ref={ref => (this.mockup = ref)}>
                <div className="toolbar">
                    <div className="toolbar-buttons">
                        <div className="toolbar-button button-close" />
                        <div className="toolbar-button button-minimize" />
                        <div className="toolbar-button button-maximize" />
                    </div>
                </div>
                <div className="content">{img ? <img src={img} /> : null}</div>
            </div>
        );
    }

    renderDownloadButton() {
        const { fileInput } = this;
        const props = {
            className: 'button',
            disabled: fileInput ? null : true,
            onClick: fileInput ? () => this.handleDownload() : null
        };
        return (
            <div>
                <a {...props}>Download mockup</a>
            </div>
        );
    }

    async handleDownload() {
        const node = document.querySelector('.mockup-browser');
        const canvas = await convertToCanvas(node);
        var dataURL = canvas.toDataURL('image/png');
        downloadImage(dataURL);
    }

    async handleFileInput() {
        try {
            const file = this.fileInput.files[0];
            const img = await getImageUrl(file);
            this.setState({ img });
        } catch (error) {
            console.log(error);
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
