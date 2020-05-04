const electron = require("electron");
const uuid = require('uuid-js');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let todayWindow;
let createWindow;
let listWindow;
let aboutWindow;

let allAppointment = [];

app.on("ready", ()=> {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Aplikasi dokter2"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("close", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"All Appointment"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("close", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"Create Appointment"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("close", () => (createWindow = null));
};

const aboutWindowCreator = () => {
    aboutWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title:"Create Appointment"
    });

    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/about.html`);
    aboutWindow.on("close", () => (aboutWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment.id = uuid.create().toString();

	allAppointment.push(appointment);
	console.log('(index.js) Current Appointment: ',allAppointment);
    sendTodayAppointments();
	createWindow.close();
});

ipcMain.on("appointment:request:list", event=> {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});

ipcMain.on("appointment:request:today", event=> {
    sendTodayAppointments();
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    allAppointment.forEach(appointment => {
        if (appointment.id === id) {
            appointment.done = true;
        }
    });

    sendTodayAppointments();
})

const DateNow = () => {
	var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const sendTodayAppointments = () => {
    const today = DateNow();
    const filtered = allAppointment.filter(
		appointment => appointment.date === today
	);

	todayWindow.webContents.send('appointment:response:today', filtered);
};

const menuTemplate = [{
        label: "File",
        submenu: [
            {
                label: "New Appointment",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "All Appointment",

                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {

        label: "View",
        submenu: [{role: "Reload"}, {role: "toggledevtolls"}]
    },

    {

        label: "About", 
            click() {
                aboutWindowCreator();
            }
    }

    

    



]