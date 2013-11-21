 var getFBEducation = function(education_history, type) {
  var schools = [];
  education_history.forEach(function(education_event) {
    if (education_event['type'] == type) {
     schools.push(education_event['school']['name']);
    }
   });
  return schools.length ? schools.join(', ') : undefined;
}

var getFBMajors = function(education_history) {
  var majors = [];
  education_history.forEach(function(education_event) {
    if (education_event['concentration']) {
     education_event['concentration'].forEach(function(concentration) {
       majors.push(concentration['name']);
      });
    }
   });
  return majors.length ? majors.join(', ') : undefined;
}

var getFBHomeCountry = function(hometown_location) {
  if (!hometown_location) {
   return null;
  }
  return hometown_location['country'];
}

var getFBLanguages = function(user_languages) {
  return user_languages
    ? user_languages.map(function(l) { return l['name'] }).join(', ')
    : '';
}
