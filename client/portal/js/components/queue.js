var React = require('react');
var queueStore = require('../stores/queueStore');
var appActions = require('../actions/appActions');
var socketActions = require('../actions/socketActions');
var icecommActions = require('../actions/icecommActions');

var Queue = React.createClass({
  getInitialState: function() {
    return queueStore.getState();
  },

  componentDidMount: function(){
    queueStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    queueStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(queueStore.getState());
  },

  handleStaffReady: function(){
    var web_name = this.props.web_name;
    socketActions.staffReady(web_name);
    appActions.clearMessages();
  },

  disconnect: function(){
    icecommActions.disconnect();
  },

  render: function(){
    var customerQueue = this.state.customerQueue;

    var customerCount = <h4 className='queue-count'>Customers Waiting: {customerQueue.length}</h4>;

    var queuedCustomers = this.state.customerQueue.map(function(custData, index) {
      return (
        <div key={custData.userId}>
          <div>Customer {index}: {custData.name}</div>
          <div>E-mail Address: {custData.email}</div>
          <div>Help: {custData.question}</div>
        </div>
        );
    });

    var dequeue = <button className='btn btn-success dequeue' onClick={ this.handleStaffReady }>Next Customer</button>;
    var disconnect = <button className='btn btn-danger disconnect' onClick={ this.disconnect }>End Session</button>;

    return (
      <div className='queue'>
        <div className='queueList'>
          {customerCount}
          {queuedCustomers}
        </div>
        { this.state.connected ? disconnect : dequeue }
      </div>
    );
  }

});

module.exports = Queue;
