function test() {
    Alert('function test()');
}

function hideAll() {
    $("#frmStart").hide();
    $("#frmVerbs").hide();
    $("#frmWords").hide();
    $("#frmVerbs").hide();
    $("#frmList").hide();
}

function checkedValue(val) {
    if (val == 1)
        return "checked";
    else
        return "";
}

function addStrValue(value_text, id, isChecked) {
    var str = "<tr><td style='text-align:center'><input type='checkbox' style='zoom:4' onclick='onClickCheckBox(this);' value ='" + id + "' " + checkedValue(isChecked) + " ></td><td>" + value_text + "</td></tr>";
    $("#gridWords > tbody:last").after(str);
}

function getToastCountItems(itemsFound) {
    if (itemsFound > 0)
        window.plugins.toast.showShortBottom("There are " + itemsFound + " items");
    else
        window.plugins.toast.showShortBottom("Data didn't find");
}

function setGridWordsBody(wordType) {
    $("#searchText").val("");

    clearTBody();

    currentWordType = wordType;

    var db = window.sqlitePlugin.openDatabase({ name: dbname });
    db.transaction(function (tx) {
        if (wordType == ALL) {
            //tx.executeSql("select * from vrows order by value_w desc;", [], function (tx, res) {
            //    var cnt = res.rows.length;
            //    for (i = 0; i < cnt; i++) {
            //        addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            //    }
            //    getToastCountItems(cnt);
            //});
        } else if (wordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        } else if (wordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + wordType + " order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        }
    });
}

function showCurrentForm(index) {
    hideAll();
    switch (index) {
        case 0:
            $("#frmStart").show();
            break;
        case BTN_WORDS_PHRASES:
            $("#frmWords").show();
            break;
        case BTN_NEW_WORDS:
            setGridWordsBody(NEW);
            $("#frmList").show();
            break;
        case BTN_ALL_WORDS:
            setGridWordsBody(ALL);
            $("#frmList").show();
            break;
        case BTN_PHRASES:
            setGridWordsBody(PHRASES);
            $("#frmList").show();
            break;
        case BTN_ANY:
            setGridWordsBody(ANY);
            $("#frmList").show();
            break;
        case BTN_VERB:
            $("#frmVerbs").show();
            break;
        case BTN_VERBS:
            setGridWordsBody(VERB);
            $("#frmList").show();
            break;
        case BTN_VERBS_IRREG:
            setGridWordsBody(VERB_IRREG);
            $("#frmList").show();
            break;
        case BTN_HOUSE:
            setGridWordsBody(HOUSE);
            $("#frmList").show();
            break;
        case BTN_CLOTHING:
            setGridWordsBody(CLOTHING);
            $("#frmList").show();
            break;
        case BTN_FOOD:
            setGridWordsBody(FOOD);
            $("#frmList").show();
            break;
        case BTN_ADJECTIVE:
            setGridWordsBody(ADJECTIVE);
            $("#frmList").show();
            break;
        case BTN_OFFICE:
            setGridWordsBody(OFFICE);
            $("#frmList").show();
            break;
        case BTN_COLLOCATION:
            setGridWordsBody(COLLOCATION);
            $("#frmList").show();
            break;
        case BTN_TRANSPORT:
            setGridWordsBody(TRANSPORT);
            $("#frmList").show();
            break;
        case BTN_MONEY:
            setGridWordsBody(MONEY);
            $("#frmList").show();
            break;
        case BTN_NATURAL:
            setGridWordsBody(NATURAL);
            $("#frmList").show();
            break;
        case BTN_ANIMALS:
            setGridWordsBody(ANIMALS);
            $("#frmList").show();
            break;
        case BTN_REST:
            setGridWordsBody(REST);
            $("#frmList").show();
            break;
        case BTN_MEDICAL:
            setGridWordsBody(MEDICAL);
            $("#frmList").show();
            break;
        case BTN_IDIOM:
            setGridWordsBody(IDIOM);
            $("#frmList").show();
            break;
        case BTN_CRIME_PUNISHMENT:
            setGridWordsBody(CRIME_PUNISHMENT);
            $("#frmList").show();
            break;
        case BTN_PERSON_FAMILY:
            setGridWordsBody(PERSON_FAMILY);
            $("#frmList").show();
            break;
        case BTN_CHK_WORDS:
            setGridWordsBody(CHK);
            $("#frmList").show();
            break;

        default:
    }
}

function onClickCheckBox(param) {
    var id = param.value;
    var isChecked = param.checked;

    var db = window.sqlitePlugin.openDatabase({ name: dbname });
    db.transaction(function (tx) {
        var chk = 0;
        if(isChecked == true)
            chk = 1;
        tx.executeSql("update words set is_checked = " + chk + " where id = " + id);
    });
}

function onClickButton(index) {
    currentForm = index;
    showCurrentForm(currentForm);
}

function clearTBody() {
    //$("#gridWords tbody tr").remove();
    //$("#gridWords").find("tr.body_caption, tr.body_caption_top").remove();
    //$("#tbodyid").empty();

    var table = document.getElementById("gridWords");
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

function onClickButtonFind() {
    var str = $("#searchText").val().toLowerCase();

    clearTBody();

    var db = window.sqlitePlugin.openDatabase({ name: dbname });
    db.transaction(function (tx) {
        if (currentWordType == ALL) {
            tx.executeSql("select * from vrows where value_w like'%" + str + "%' order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        } else if (currentWordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " and value_w like'%" + str + "%' order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        } else if (currentWordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 and value_w like'%" + str + "%' order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + currentWordType + " and value_w like'%" + str + "%' order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, i);
                }
                getToastCountItems(cnt);
            });
        }
    });
}

function onClickBack() {
    switch (currentForm) {
        case BTN_WORDS_PHRASES:
        case BTN_NEW_WORDS:
        case BTN_ALL_WORDS:
        case BTN_CHK_WORDS:
            currentForm = 0;
            showCurrentForm(currentForm);
            break;
        case BTN_PHRASES:
        case BTN_ANY:
        case BTN_VERB:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS_IRREG:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_HOUSE:
        case BTN_CLOTHING:
        case BTN_FOOD:
        case BTN_ADJECTIVE:
        case BTN_OFFICE:
        case BTN_COLLOCATION:
        case BTN_TRANSPORT:
        case BTN_MONEY:
        case BTN_NATURAL:
        case BTN_ANIMALS:
        case BTN_REST:
        case BTN_MEDICAL:
        case BTN_IDIOM:
        case BTN_CRIME_PUNISHMENT:
        case BTN_PERSON_FAMILY:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        default:
            navigator.app.exitApp();
    }
}