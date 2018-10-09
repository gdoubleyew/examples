const React = require('react')
const ReactDOM = require('react-dom')
const toml = require('toml')
const { Tab, Tabs, TabList, TabPanel } = require('react-tabs')

const elem = React.createElement;


class SettingsPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {},
      tomlFile: 'example.toml',
      tomlErrorMsg: '',
    }
    this.settingsInputForm = this.settingsInputForm.bind(this)
    this.tomlInputForm = this.tomlInputForm.bind(this)
    this.loadTomlFile = this.loadTomlFile.bind(this)
    this.textInputField = this.textInputField.bind(this)
    this.textInputField = this.textInputField.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
    this.submitOnClick = this.submitOnClick.bind(this)
  }

  tomlInputForm(props) {
    const form =
      elem('fieldset', {},
        elem('legend', {}, 'Select Toml Configuration File:'),
        elem('input', {
          type: 'file',
          onChange: (event) => {
            let reader = new FileReader()
            reader.onload = this.loadTomlFile
            reader.readAsText(event.target.files[0])
          },
        }),
        elem('p', {}, this.state.tomlErrorMsg)
      )
    return form
  }

  loadTomlFile(event) {
    try {
      const configData = toml.parse(event.target.result)
      this.setState({ config: configData, tomlErrorMsg: '' })
    } catch (err) {
      this.setState({ tomlErrorMsg: err.message })
    }
  }

  inputOnChange(event) {
    const section = event.target.attributes.section.value
    var revSection = Object.assign({}, this.state.config[section], { [event.target.name]: event.target.value })
    var revConfig = Object.assign({}, this.state.config, { [section]: revSection })
    this.setState({ config: revConfig })
  }

  textInputField(props) {
    return elem('p', { key: props.name },
      props.name + ': ',
      elem('input', Object.assign(props, { value: this.state.config[props.section][props.name], onChange: this.inputOnChange })),
    )
  }

  settingsInputForm(props) {
    var formSections = []
    for (let section in this.state.config) {
      let subform = Object.keys(this.state.config[section]).map(k =>
        this.textInputField({ name: k, section: section })
      )
      formSections.push(
        elem('fieldset', { key: section },
          elem('legend', {}, section),
          subform,
        )
      )
    }
    const form =
      elem('fieldset', {},
        elem('legend', {}, 'Configurations'),
        elem('p', { align: 'right' },
          elem('button', { onClick: this.submitOnClick, style: {align: 'right'} }, 'submit'),
        ),
        formSections,
      )
    return form
  }

  submitOnClick(event) {
    console.log('settingsChange: ' + this.state.config)
  }

  render() {
    // if (this.errorMsg) {
    // var errElem = elem('span', {}, this.errorMsg)
    // }
    return elem('div', {},
      this.tomlInputForm({}),
      elem('br'),
      this.settingsInputForm({})
    )
  }
}


class StatusPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {imgDir: '/tmp/img'},
      runNum: '',
      scanNum: '',
      files: [],
    }

    this.runNumOnChange = this.runNumOnChange.bind(this)
    this.scanNumOnChange = this.scanNumOnChange.bind(this)
    this.runBttnOnClick = this.runBttnOnClick.bind(this)
  }

  runNumOnChange(event) {
    this.setState({ runNum: event.target.value })
  }

  scanNumOnChange(event) {
    this.setState({ scanNum: event.target.value })
  }

  runBttnOnClick(event) {
    // TODO: Watch the mriImgDir for new files created matching the run and scan numbers
    console.log(`Run ${this.state.runNum}: Watch directory ${this.state.config.imgDir} for new scans`)
  }

  componentDidMount() {
    // const self = this
  }

  render() {
    const fileList = this.state.files.map((file, idx) =>
      elem('li', { key: idx }, file)
    )
    return elem('div', {},
      elem('p', {}, `MRI Scans Directory: ${this.state.config.imgDir}`),
      elem('hr'),
      elem('p', {}, 'Run #: ',
        elem('input', { value: this.state.runNum, onChange: this.runNumOnChange }),
      ),
      elem('p', {}, 'Scan #: ',
        elem('input', { value: this.state.scanNum, onChange: this.scanNumOnChange }),
      ),
      elem('button', { onClick: this.runBttnOnClick }, 'Run'),
      elem('hr'),
      elem('ul', {}, fileList),
    )
  }
}


class RtAtten extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      settingsPane: new SettingsPane(),
      statusPane: new StatusPane(),
      errorMsg: '',
    }
  }

  render() {
    // if (this.errorMsg) {
    // var errElem = elem('span', {}, this.errorMsg)
    // }
    var tp =
     elem(Tabs, {},
       elem(TabList, {},
         elem(Tab, {}, 'Run'),
         elem(Tab, {}, 'Settings'),
       ),
       elem(TabPanel, {},
         elem(StatusPane, {}),
       ),
       elem(TabPanel, {},
         elem(SettingsPane, {}),
       ),
     )
    return tp
    // return elem('div', {},
    //   this.tomlInputForm({}),
    //   elem('br'),
    //   this.settingsInputForm({})
    // )
  }
}

// function TabPage() {
//   var tp =
//    elem(Tabs, {},
//      elem(TabList, {},
//        elem(Tab, {}, 'Run'),
//        elem(Tab, {}, 'Settings'),
//      ),
//      elem(TabPanel, {},
//        elem(StatusPane, {}),
//      ),
//      elem(TabPanel, {},
//        elem(SettingsPane, {}),
//      ),
//    )
//   return tp
// }

const tabContainer = document.querySelector('#tabs_container');
// ReactDOM.render(elem('div', {}, elem(TabPage, {})), tabContainer);
ReactDOM.render(elem(RtAtten), tabContainer);
