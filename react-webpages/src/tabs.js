const React = require('react')
const ReactDOM = require('react-dom')
const toml = require('toml')
const { Tab, Tabs, TabList, TabPanel } = require('react-tabs')

const elem = React.createElement;


class SettingsPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tomlFile: 'example.toml',
      tomlErrorMsg: '',
    }
    this.settingsInputForm = this.settingsInputForm.bind(this)
    this.tomlInputForm = this.tomlInputForm.bind(this)
    this.loadTomlFile = this.loadTomlFile.bind(this)
    this.textInputField = this.textInputField.bind(this)
    this.textInputField = this.textInputField.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
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
      this.props.setConfig(configData)
    } catch (err) {
      this.setState({ tomlErrorMsg: err.message })
    }
  }

  inputOnChange(event) {
    const section = event.target.attributes.section.value
    var revSection = Object.assign({}, this.props.config[section], { [event.target.name]: event.target.value })
    var revConfig = Object.assign({}, this.props.config, { [section]: revSection })
    this.props.setConfig(revConfig)
  }

  textInputField(props) {
    return elem('p', { key: props.name },
      props.name + ': ',
      elem('input', Object.assign(props, { value: this.props.config[props.section][props.name], onChange: this.inputOnChange })),
    )
  }

  settingsInputForm(props) {
    var formSections = []
    for (let section in this.props.config) {
      let subform = Object.keys(this.props.config[section]).map(k =>
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
        formSections,
      )
    return form
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
      files: [],
    }

    this.runNumOnChange = this.runNumOnChange.bind(this)
    this.scanNumOnChange = this.scanNumOnChange.bind(this)
    this.runBttnOnClick = this.runBttnOnClick.bind(this)
  }

  runNumOnChange(event) {
    this.props.setConfigItem('Runs', [event.target.value])
  }

  scanNumOnChange(event) {
    this.props.setConfigItem('ScanNums', [event.target.value])
  }

  runBttnOnClick(event) {
    // TODO: Watch the mriImgDir for new files created matching the run and scan numbers
    console.log(`Run ${this.props.getConfigItem('Runs')}: Watch directory ${this.props.getConfigItem('imgDir')} for new scans`)
  }

  componentDidMount() {
    // const self = this
  }

  render() {
    const fileList = this.state.files.map((file, idx) =>
      elem('li', { key: idx }, file)
    )
    return elem('div', {},
      elem('p', {}, `MRI Scans Directory: ${this.props.getConfigItem('imgDir')}`),
      elem('hr'),
      elem('p', {}, 'Run #: ',
        elem('input', { value: this.props.getConfigItem('Runs'), onChange: this.runNumOnChange }),
      ),
      elem('p', {}, 'Scan #: ',
        elem('input', { value: this.props.getConfigItem('ScanNums'), onChange: this.scanNumOnChange }),
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
      config: {},
      errorMsg: '',
    }
    this.setConfig = this.setConfig.bind(this);
    this.getConfigItem = this.getConfigItem.bind(this);
    this.setConfigItem = this.setConfigItem.bind(this);
  }

  setConfig(newConfig) {
    this.setState({config: newConfig})
  }

  getConfigItem(name) {
    for (let section in this.state.config) {
      for (let key in this.state.config[section]) {
        if (key == name) {
          return this.state.config[section][key]
        }
      }
    }
    return ''
  }

  setConfigItem(name, value) {
    for (let section in this.state.config) {
      for (let key in this.state.config[section]) {
        if (key == name) {
          var revSection = Object.assign({}, this.state.config[section], { [name]: value })
          var revConfig = Object.assign({}, this.state.config, { [section]: revSection })
          return this.setState({config: revConfig})
        }
      }
    }
    return null
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
         elem(StatusPane,
           {config: this.state.config,
            setConfig: this.setConfig,
            getConfigItem: this.getConfigItem,
            setConfigItem: this.setConfigItem,
           }
         ),
       ),
       elem(TabPanel, {},
         elem(SettingsPane,
           {config: this.state.config,
            setConfig: this.setConfig,
            getConfigItem: this.getConfigItem,
            setConfigItem: this.setConfigItem,
           }
         ),
       ),
     )
    return tp
  }
}

function Render() {
  const tabDiv = document.getElementById('tabs_container');
  ReactDOM.render(elem(RtAtten), tabDiv);
}

Render()
