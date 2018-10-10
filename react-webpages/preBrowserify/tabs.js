'use strict';

const { Tabs, TabList, Tab, TabPanel } = ReactTabs;

// var e = React.createElement;

function TabPage() {
  var tp =
   e(Tabs, {},
     e(TabList, {},
       e(Tab, {}, 'Title 1'),
       e(Tab, {}, 'Title 2'),
     ),
     e(TabPanel, {},
       e('h2', {}, 'Any content 1'),
     ),
     e(TabPanel, {},
       e('h2', {}, 'Any content 2'),
     ),
   )
  return tp
}

const tabContainer = document.querySelector('#tabs_container');
// ReactDOM.render(e('div', {}, e(TabPage, {})), tabContainer);
ReactDOM.render(e(TabPage), tabContainer);
