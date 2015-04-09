//tonk0006_giftr.js

var tonk0006_giftr = {
    loadRequirements: 0,
    db: null,
    version: '',
    person_name: '',
    occasion_name: '',
    init: function () {
        document.addEventListener('deviceready', this.onDeviceReady);
        document.addEventListener('DOMContentLoaded', this.onDomReady);
    },
    onDeviceReady: function () {
        //alert("Device is ready");
        //        tonk0006_giftr.loadRequirements++;
        //        if (tonk0006_giftr.loadRequirements === 2) {
        tonk0006_giftr.start();
        //        }
    },
    onDomReady: function () {
        //alert("DOM is ready");
        //        tonk0006_giftr.loadRequirements++;
        //        if (tonk0006_giftr.loadRequirements === 2) {
        tonk0006_giftr.start();
        //        }
    },
    start: function () {
        //connect to database
        //build the lists for the main pages based on data
        //add button and navigation listeners

        console.log("Connecting to database...");
        tonk0006_giftr.db = openDatabase('giftrDB', '', 'Giftr Database', 1024 * 1024);

        if (tonk0006_giftr.db.version == "") {
            console.log('First time running database... Creating new tables.');

            tonk0006_giftr.db.changeVersion("", "1.0",
                function (trans) {

                    trans.executeSql("CREATE TABLE IF NOT EXISTS people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)", [],
                        function (tx, rs) {
                            console.log("Table people created.");
                        },
                        function (tx, err) {
                            console.error(err.message);
                        });
                    trans.executeSql("CREATE TABLE IF NOT EXISTS occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)", [],
                        function (tx, rs) {
                            console.log("Table occasions created.");
                        },
                        function (tx, err) {
                            console.error(err.message);
                        });
                    trans.executeSql("CREATE TABLE IF NOT EXISTS gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea TEXT, purchased BOOLEAN)", [],
                        function (tx, rs) {
                            console.log("Table gifts created.");
                        },
                        function (tx, err) {
                            console.error(err.message);
                        });
                },
                function (err) {
                    console.error(err.message);
                },
                function () {
                    tonk0006_giftr.displayPeopleList();
                });
        } else {
            console.log("Successfully connected to database!");

            tonk0006_giftr.displayPeopleList();
        }

        tonk0006_giftr.displayPeopleList();

        var addButtons = document.querySelectorAll('.btnAdd');
        addButtons[0].addEventListener('click', tonk0006_giftr.openNewPersonModal);
        addButtons[1].addEventListener('click', tonk0006_giftr.openNewOccasionModal);
        addButtons[2].addEventListener('click', tonk0006_giftr.openNewGiftForPersonModal);
        addButtons[3].addEventListener('click', tonk0006_giftr.openNewGiftForOccasionModal);

        var cancelButtons = document.querySelectorAll('.btnCancel');
        cancelButtons[0].addEventListener('click', tonk0006_giftr.displayPeopleList);
        cancelButtons[1].addEventListener('click', tonk0006_giftr.displayOccasionList);
        cancelButtons[2].addEventListener('click', tonk0006_giftr.cancelModal);
        cancelButtons[3].addEventListener('click', tonk0006_giftr.cancelModal);

        var saveButtons = document.querySelectorAll('.btnSave');
        saveButtons[0].addEventListener('click', tonk0006_giftr.savePerson);
        saveButtons[1].addEventListener('click', tonk0006_giftr.saveOccasion);
        saveButtons[2].addEventListener('click', tonk0006_giftr.saveGift);
        saveButtons[3].addEventListener('click', tonk0006_giftr.saveItem);

        document.querySelector('.apptitle').addEventListener('click', tonk0006_giftr.displayPeopleList);

        var list = document.querySelectorAll('[data-role="listview"]');
        var hm1 = new Hammer.Manager(list[0]);
        var hm2 = new Hammer.Manager(list[1]);

        var singleTap1 = new Hammer.Tap({
            event: 'singletap'
        });

        var doubleTap1 = new Hammer.Tap({
            event: 'doubletap',
            taps: 2,
            threshold: 10,
            posThreshold: 40
        });

        var singleTap2 = new Hammer.Tap({
            event: 'singletap'
        });

        var doubleTap2 = new Hammer.Tap({
            event: 'doubletap',
            taps: 2,
            threshold: 10,
            posThreshold: 40
        });

        hm1.add([doubleTap1, singleTap1]);
        hm2.add([doubleTap2, singleTap2]);
        doubleTap1.recognizeWith(singleTap1);
        doubleTap2.recognizeWith(singleTap2);
        doubleTap1.requireFailure(singleTap1);
        doubleTap2.requireFailure(singleTap2);

        hm1.on('singletap', tonk0006_giftr.displayGiftsForPerson);
        hm2.on('singletap', tonk0006_giftr.displayGiftsForOccasion);
        hm1.on('doubletap', tonk0006_giftr.deleteListItem);
        hm2.on('doubletap', tonk0006_giftr.deleteListItem);

        var goToPeople = new Hammer(document.querySelector('[data-role=page]#occasion-list'));
        goToPeople.on('swiperight', tonk0006_giftr.displayPeopleList);

        var goToOccassions = new Hammer(document.querySelector('[data-role=page]#people-list'));
        goToOccassions.on('swipeleft', tonk0006_giftr.displayOccasionList);

    },

    displayPeopleList: function () {
        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'block';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'none';
    },

    displayOccasionList: function () {
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'none';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'block';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'none';
    },

    displayGiftsForPerson: function (ev) {
        document.querySelector('[data-role=page]#people-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'block';
        document.querySelector('.titlebutton').style.display = 'block';
        //        var name = ev.target.getAttribute('data-ref');
        var name = ev.target.innerHTML;
        console.log(name);
        var paras = document.querySelectorAll('.details');
        if (paras[2].innerHTML !== '')
            paras[2].innerHTML = 'Here are all the gift ideas for <strong>' + name + '</strong> for all occasions.';
        person_name = name;
    },

    displayGiftsForOccasion: function (ev) {
        document.querySelector('[data-role=page]#occasion-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'block';
        document.querySelector('.titlebutton').style.display = 'block';
        //        var occasion = ev.target.getAttribute('data-ref');
        var occasion = ev.target.innerHTML;
        console.log(occasion);
        var paras = document.querySelectorAll('.details');
        if (paras[3].innerHTML !== '')
            paras[3].innerHTML = 'Here are all the gift ideas for <strong>' + occasion + '</strong> for all people.';
        occasion_name = occasion;
    },

    openNewPersonModal: function () {
        console.log('Person modal window opened');
        document.querySelector('[data-role=modal]#add-person').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        //        document.querySelector('#new-per').value = '';
        var input = document.querySelector('#new-per');
        input.value = '';
        input.focus();
        input.addEventListener('keypress', function (ev) {
            ev.stopImmediatePropagation();
            if (ev.keyCode === 13) {
                ev.preventDefault();
                //console.log(ev);
                tonk0006_giftr.savePerson();
                input.blur();
            }
        });
    },

    openNewOccasionModal: function () {
        console.log('Occasion modal window opened');
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        var input = document.querySelector('#new-occ');
        input.value = '';
        input.focus();
        input.addEventListener('keypress', function (ev) {
            ev.stopImmediatePropagation();
            if (ev.keyCode === 13) {
                ev.preventDefault();
                tonk0006_giftr.saveOccasion();
                input.blur();
            }
        });
    },

    openNewGiftForPersonModal: function () {
        console.log('Gift for person modal window opened');
        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        //        var nameArray = document.querySelectorAll('li');
        //        var list = document.querySelectorAll('li');
        //        console.log(list);
        var headings = document.querySelectorAll('h3');
        headings[2].innerHTML = 'New gift for <strong>' + person_name + '</strong>.';

        //        var list = document.querySelector('#occasion-list [data-role="listview"]');
        //        console.log(list);
        document.getElementById('list-per').value[0] = occasion_name;
        //        document.getElementById('list-per').innerHTML = list;
    },

    openNewGiftForOccasionModal: function () {
        console.log('Gift for occasion modal window opened');
        document.querySelector('[data-role=modal]#add-gift-occ').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        var headings = document.querySelectorAll('h3');
        headings[3].innerHTML = 'New gift for <strong>' + occasion_name + '</strong>.';

        //        var list = document.querySelector('#occasion-list [data-role="listview"]');
        //        console.log(list);
        document.getElementById('list-per').value[0] = person_name;
        //        document.getElementById('list-per').innerHTML = list;
    },

    savePerson: function () {
        var ul = document.querySelectorAll('[data-role="listview"]');
        var li = document.createElement('li');
        var text = document.querySelector('#new-per').value;
        li.innerHTML = text;
        //        li.setAttribute('data-ref', text);
        li.setAttribute('id', text);
        if (text)
            ul[0].appendChild(li);
        //        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        //        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        //        document.querySelector('[data-role=overlay]').style.display = 'none';

        tonk0006_giftr.db.transaction(function (trans) {
            trans.executeSql("INSERT INTO people(person_name) VALUES('" + text + "')", [],
                function (tx, rs) {
                    console.log(text + " " + "has been added to the database.");
                    text = null;
                    tonk0006_giftr.displayPeopleList();
                },
                function (tx, err) {
                    console.error(err.message);
                });
        });
    },

    saveOccasion: function () {
        var ul = document.querySelectorAll('[data-role="listview"]');
        var li = document.createElement('li');
        var text = document.querySelector('#new-occ').value;
        li.innerHTML = text;
        //        li.setAttribute('data-ref', text);
        li.setAttribute('id', text);
        if (text)
            ul[1].appendChild(li);
        //        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        //        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        //        document.querySelector('[data-role=overlay]').style.display = 'none';

        tonk0006_giftr.db.transaction(function (trans) {
            trans.executeSql("INSERT INTO occasions(occ_name) VALUES('" + text + "')", [],
                function (tx, rs) {
                    console.log(text + " " + "has been added to the database.");
                    tonk0006_giftr.displayOccasionList();
                },
                function (tx, err) {
                    console.error(err.message);
                });
        });
    },

    saveGiftForPerson: function () {
        //        var ul = document.querySelectorAll('[data-role="listview"]');
        //        var li = document.createElement('li');
        //        var text = document.querySelector('#list-per').value;
        //        li.innerHTML = text;
        //        li.setAttribute('data-ref', text);
        //        li.setAttribute('id', text);
        //        if(text)
        //            ul[2].appendChild(li);
        //        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'none';
        //        document.querySelector('[data-role=overlay]').style.display = 'none';
    },

    saveGiftForOccasion: function () {
        //        var ul = document.querySelectorAll('[data-role="listview"]');
        //        var li = document.createElement('li');
        //        var text = document.querySelector('#list-per').value;
        //        li.innerHTML = text;
        //        li.setAttribute('data-ref', text);
        //        li.setAttribute('id', text);
        //        if(text)
        //            ul[2].appendChild(li);
        //        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'none';
        //        document.querySelector('[data-role=overlay]').style.display = 'none';
    },

    deleteListItem: function (ev) {
        console.log('Double-tap event occured');
        var item = ev.target.innerHTML;
        var li = document.getElementById(item);
        li.parentNode.removeChild(li);
        console.log('Item ' + item + ' deleted from screen');
        tonk0006_giftr.db.transaction(function (tr) {
            tr.executeSql("DELETE FROM people WHERE person_name = '" + item + "'", [],
                function (tx, rs) {
                    console.log('Item ' + item + ' has been deleted from the database.')
//                    tonk0006_giftr.displayOccasionList();
                },
                function (tx, err) {
                    console.info(err.message);
                });
        });
    },

    cancelModal: function () {
        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'none';
        document.querySelector('[data-role=modal]#add-gift-occ').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
    }
}

tonk0006_giftr.init();