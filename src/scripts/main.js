import {info} from './components/info'
import $ from 'jquery'

document.addEventListener("DOMContentLoaded", function () { 
    // Code
    info()
    $('body').click(function() {
        alert('index')
    })
});