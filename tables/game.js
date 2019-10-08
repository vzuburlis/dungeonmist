gtableFieldDisplay.start_time = function(rv) {
  dt = new Date(rv.start_time*1000)
  return dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
}
