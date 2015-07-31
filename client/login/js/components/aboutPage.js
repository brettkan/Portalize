var React = require('react');
var About = require('./about');
var TechStack = require('./techStack');

var AboutPage = React.createClass({

  render: function() {
    return (
      <div>
        <About />
        <TechStack />
      </div>
    )
  }
});

module.exports = AboutPage;
