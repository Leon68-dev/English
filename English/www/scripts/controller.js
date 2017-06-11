function test() {
    Alert('function test()');
}

function hideAll() {
    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmWords").hide();
    $("#frmWords").submit(function () {
        return false;
    });

    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmList").hide();
    $("#frmList").submit(function () {
        return false;
    });

    $("#frmBackup").hide();
    $("#frmBackup").submit(function () {
        return false;
    });

    $("#frmAddWord").hide();
    $("#frmAddWord").submit(function () {
        return false;
    });
    
    $("#frmEditWord").hide();
    $("#frmEditWord").submit(function () {
        return false;
    });

    $("#frmCategories").hide();
    $("#frmCategories").submit(function () {
        return false;
    });
    
    $("#frmAddCategories").hide();
    $("#frmAddCategories").submit(function () {
        return false;
    });
    
    $("#frmEditCategories").hide();
    $("#frmEditCategories").submit(function () {
        return false;
    });

    $("#frmCategoriesButtons").hide();
    $("#frmCategoriesButtons").submit(function () {
        return false;
    });

}

function checkedValue(val) {
    if (val == 1)
        return "checked";
    else
        return "";
}

function addStrValue(value_text, value_text2, id, isChecked) {
    var value_t = "";
    if (value_text && value_text != "undefined")
        value_t = value_text;

    if (value_text2 && value_text2 != "undefined")
        value_t += ("<br> - " + value_text2);

    var str = "<tr ><td width='20%' style='text-align:center'><input type='checkbox' style='zoom:3' onclick='onClickCheckBox(this);' value ='"
            + id + "' " + checkedValue(isChecked)
            + "></td><td style='word-wrap:break-word'>" + value_t
            + "</td><td width='10%'><a href='#' class='ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline' onclick='editWord(" + id + ");'>Edit</a>"
            + "<a href='#' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline' onclick='delWord(" + id + ");'>Delete</a>"
            + "</td></tr>";
    $("#gridWords > tbody:last").after(str);
}

function addStrValueCategories(id, name) {
    var value_t = name  /* ("<br> - " + name) */;
    var str = "<tr ><td style='word-wrap:break-word'>" + value_t
            + "</td><td width='10%'><a href='#' class='ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline' onclick='editCategorie(" + id + ");'>Edit</a>"
            + "<a href='#' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline' onclick='delCategorie(" + id + ");'>Delete</a>"
            + "</td></tr>";
    $("#gridCategories > tbody:last").after(str);
}

function editWord(idWord) {
    selectWordById(idWord, function (res) {
        setDataToSelect('selectedGroupsEdit', res.rows.item(0).code);
        $("#inputEnglishWordEdit").val(res.rows.item(0).value_w);
        $("#inputRussianWordEdit").val(res.rows.item(0).value_w2);
        editWordID = idWord;
        onClickButton(BTN_EDT_WORD);
    });
}

function delWord(idWord) {
    var r = confirm('Would you like to delete data?');
    if (r == true) {
        selectWordById(idWord, function (res) {
            var idType = res.rows.item(0).code;
            deleteRelation(idWord, idType, function (res2) {
                deleteWordById(idWord, function (res3) {
                    setGridWordsBody(currentWordType);
                    window.plugins.toast.showShortBottom("Data was deleted");
                });
            });
        });
    }
}

function getToastCountItems(itemsFound) {
    if (getSearchText() != "") {
        if (itemsFound > 0)
            window.plugins.toast.showShortBottom("There are " + itemsFound + " items");
        else
            window.plugins.toast.showShortBottom("Data didn't find");
    }
}

function setGridWordsBody(wordType) {
    $("#searchText").val("");
    clearTBody();
    currentWordType = wordType;
    var db = openDatabase();
    db.transaction(function (tx) {
        //if (wordType == NEW) {
        //    tx.executeSql("select * from vrows where code = " + NEW + " order by id desc;", [], function (tx, res) {
        //        var cnt = res.rows.length;
        //        for (i = 0; i < cnt; i++) {
        //            addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
        //        }
        //        getToastCountItems(cnt);
        //    },function(tx, error) {
        //        console.log('SELECT error: ' + error.message);
        //    });
        //} else

        if (wordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + wordType + " order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function onClickCheckBox(param) {
    var id = param.value;
    var isChecked = param.checked;

    var db = openDatabase();
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
    var table = document.getElementById("gridWords");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}

function clearTBodyCategories() {
    var table = document.getElementById("gridCategories");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}

function getSearchText() {
    var str = $("#searchText").val().toLowerCase();
    return str;
}

function onClickButtonFind() {
    clearTBody();
    var db = openDatabase();
    db.transaction(function (tx) {
        if (currentWordType == ALL) {
            tx.executeSql("select * from vrows where (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        //} else if (currentWordType == NEW) {
        //    tx.executeSql("select * from vrows where code = " + NEW + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
        //        var cnt = res.rows.length;
        //        for (i = 0; i < cnt; i++) {
        //            addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
        //        }
        //        getToastCountItems(cnt);
        //    }, function (tx, error) {
        //        console.log('SELECT error: ' + error.message);
        //    });
        } else if (currentWordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + currentWordType + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function addZerro(param) {
    if (param < 10)
        return ('0' + param);
    return param;
}

function dateFormat() {
    var today = new Date();
    var dt = today.getFullYear()
        + '-'
        + addZerro(today.getMonth() + 1)
        + '-'
        + addZerro(today.getDate())
        + '_'
        + addZerro(today.getHours())
        + '-'
        + addZerro(today.getMinutes())
        + '-'
        + addZerro(today.getSeconds())
        + '-'
        + today.getMilliseconds();
    return dt;
}

function failFiles(error) {
    if (error.code == FileError.NOT_FOUND_ERR) alert("Message : NOT_FOUND_ERR")
    else if (error.code == FileError.SECURITY_ERR) alert("Message : SECURITY_ERR")
    else if (error.code == FileError.ABORT_ERR) alert("Message : ABORT_ERR")
    else if (error.code == FileError.NOT_READABLE_ERR) alert("Message : NOT_READABLE_ERR")
    else if (error.code == FileError.ENCODING_ERR) alert("Message : ENCODING_ERR")
    else if (error.code == FileError.NO_MODIFICATION_ALLOWED_ERR) alert("Message : NO_MODIFICATION_ALLOWED_ERR")
    else if (error.code == FileError.INVALID_STATE_ERR) alert("Message : INVALID_STATE_ERR")
    else if (error.code == FileError.SYNTAX_ERR) alert("Message : SYNTAX_ERR")
    else if (error.code == FileError.INVALID_MODIFICATION_ERR) alert("Message :  INVALID_MODIFICATION_ERR")
    else if (error.code == FileError.QUOTA_EXCEEDED_ERR) alert("Message : QUOTA_EXCEEDED_ERR")
    else if (error.code == FileError.PATH_EXISTS_ERR) alert("Message : PATH_EXISTS_ERR")

    showCurrentForm(BTN_BACKUP);
}

function exportDatabase() {
    var r = confirm('Would you like to export data?');
    if (r == true) {
        var source = cordova.file.dataDirectory + "";
        source = source.replace("/files/", "/databases/") + model_dbname;
        var destination = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                var filename = 'english_' + dateFormat() + '.db';
                fs.copyTo(directoryEntry, filename, function () { }, failFiles);
                fs.copyTo(directoryEntry, model_dbname_backup, function () {
                    showCurrentForm(BTN_ALL_WORDS);
                    alert("Export ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function importDatabase() {
    var r = confirm('Would you like to import data?');
    if (r == true) {
        var source = cordova.file.externalRootDirectory + model_dbname_backup;
        var destination = cordova.file.dataDirectory + "";
        destination = destination.replace("/files/", "/databases/");
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                fs.copyTo(directoryEntry, model_dbname, function () {
                    showCurrentForm(BTN_ALL_WORDS);
                    alert("Import ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function setDataToSelect(nameSelector, selectID) {
    $('#' + nameSelector).empty();
    selectTypes(function (res) {
        var cnt = res.rows.length;
        if (cnt > 0) {
            for (var i = 0; i < cnt; i++) {
                $('#' + nameSelector).append('<option value=' + res.rows.item(i).id + '>' + res.rows.item(i).name + '</option>');
            }
            if (selectID > 0)
                $('#' + nameSelector).val(selectID).selectmenu("refresh");
            else
                $('#' + nameSelector).val(res.rows.item(0).id).selectmenu("refresh");
        }
    });
}

function saveNewWord() {
    var value_w = $("#inputEnglishWord").val();
    var value_w2 = $("#inputRussianWord").val();
    var id_type = $("#selectedGroups").val();

    if (value_w && value_w2) {
        insertWordById(0, value_w, value_w2, 0, function (res) {
            selectMaxWordsID(function (res) {
                if (res && res.rows && res.rows.length) {
                    var id_words = res.rows.item(0).maxID;
                    insertRelation(id_words, id_type, function (res3) {
                        $("#inputEnglishWord").val('');
                        $("#inputRussianWord").val('');
                        showCurrentForm(BTN_ADD_WORD);
                        window.plugins.toast.showShortBottom("Data was saved");
                    });
                }
            });
        })
    } else {
        $("#inputEnglishWord").val('');
        $("#inputRussianWord").val('');
        showCurrentForm(BTN_ADD_WORD);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelNewWord() {
    $("#inputEnglishWord").val('');
    $("#inputRussianWord").val('');
    showCurrentForm(BTN_ADD_WORD);
    window.plugins.toast.showShortBottom("Data was canceled");
}

function saveEditWord() {
    var value_w = $("#inputEnglishWordEdit").val();
    var value_w2 = $("#inputRussianWordEdit").val();
    var id_type = $("#selectedGroupsEdit").val();
    if (value_w && value_w2 && id_type) {
        updateWordById(editWordID, value_w, value_w2, function (res) {
            updateRelation(editWordID, id_type, function (res) {
                showCurrentForm(prevEditForm);
                currentForm = BTN_ALL_WORDS;
                window.plugins.toast.showShortBottom("Data was saved");
            });
        });
    } else {
        showCurrentForm(prevEditForm);
        currentForm = BTN_ALL_WORDS;
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelEditWord() {
    showCurrentForm(prevEditForm);
    currentForm = BTN_ALL_WORDS;
    window.plugins.toast.showShortBottom("Data was canceled");
}

function setGridCategoriesBody() {
    clearTBodyCategories();
    selectCategories(function (res) {
        var cnt = res.rows.length;
        for (i = 0; i < cnt; i++) {
            addStrValueCategories(res.rows.item(i).id, res.rows.item(i).name);
        }
        getToastCountItems(cnt);
    });
}

function saveNewCategorie() {
    var name = $("#inputCategorie").val();
    if (name) {
        insertCategorie(name.trim().toLocaleUpperCase(), function (res) {
            $("#inputCategorie").val('');
            showCurrentForm(BTN_CATEG);
            window.plugins.toast.showShortBottom("Data was saved");
        });
    } else {
        $("#inputCategorie").val('');
        showCurrentForm(BTN_CATEG);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelCategorie() {
    $("#inputCategorie").val('');
    $("#inputCategorieEdit").val('');
    showCurrentForm(BTN_CATEG);
    window.plugins.toast.showShortBottom("Data was canceled");
}

function editCategorie(idCategorie) {
    selectCategorieById(idCategorie, function (res) {
        $("#inputCategorieEdit").val(res.rows.item(0).name);
        editCategorieID = idCategorie;
        onClickButton(BTN_EDT_CATEG);
    });
}

function delCategorie(id) {
    var r = confirm('Would you like to delete data?');
    if (r == true) {
        checkCategoriesInRelations(id, function (res) {
            if (res == 0) {
                deleteCategorieById(id, function (res) {
                    setGridCategoriesBody();
                    window.plugins.toast.showShortBottom("Data was deleted");
                });
            } else {
                window.plugins.toast.showShortBottom("Data cannot be deleted");
            }
        });
    }
}

function saveEditCategorie() {
    var name = $("#inputCategorieEdit").val();
    if (name) {
        updateCategorie(editCategorieID, name.trim().toUpperCase(), function (res) {
            $("#inputCategorieEdit").val('');
            showCurrentForm(BTN_CATEG);
            window.plugins.toast.showShortBottom("Data was saved");
        });
    } else {
        $("#inputCategorieEdit").val('');
        showCurrentForm(BTN_CATEG);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function setCategoriesButtons() {
    $("#categoriesButtons").empty();
    selectCategoriesButtons(function (res) {
        var cnt = res.rows.length;
        for (i = 0; i < cnt; i++) {
            var li = '<li style="text-align:center;"><button class="ui-btn ui-corner-all" onclick="onClickCategorieButton(' + res.rows.item(i).id + ');">' + res.rows.item(i).name + '</button></li>';
            $("#categoriesButtons").append(li);
        }
    });
}

function onClickCategorieButton(id) {
    hideAll();
    currentForm = BTN_CATEG_VIEW_DETAIL;
    prevEditForm = BTN_CATEG_VIEW;
    setGridWordsBody(id);
    $("#frmList").show();
}

function showCurrentForm(index) {
    hideAll();
    switch (index) {
        case 0:
        case BTN_ALL_WORDS:
            prevEditForm = BTN_ALL_WORDS;
            setGridWordsBody(ALL);
            $("#frmList").show();
            break;
        //case BTN_WORDS_PHRASES:
        //    $("#frmWords").show();
        //    break;
        //case BTN_NEW_WORDS:
        //    prevEditForm = index;
        //    setGridWordsBody(NEW);
        //    $("#frmList").show();
        //    break;
        //case BTN_PHRASES:
        //    prevEditForm = index;
        //    setGridWordsBody(PHRASES);
        //    $("#frmList").show();
        //    break;
        //case BTN_ANY:
        //    prevEditForm = index;
        //    setGridWordsBody(ANY);
        //    $("#frmList").show();
        //    break;
        //case BTN_VERB:
        //    $("#frmVerbs").show();
        //    break;
        //case BTN_VERBS:
        //    prevEditForm = index;
        //    setGridWordsBody(VERB);
        //    $("#frmList").show();
        //    break;
        //case BTN_VERBS_IRREG:
        //    prevEditForm = index;
        //    setGridWordsBody(VERB_IRREG);
        //    $("#frmList").show();
        //    break;
        //case BTN_HOUSE:
        //    prevEditForm = index;
        //    setGridWordsBody(HOUSE);
        //    $("#frmList").show();
        //    break;
        //case BTN_CLOTHING:
        //    prevEditForm = index;
        //    setGridWordsBody(CLOTHING);
        //    $("#frmList").show();
        //    break;
        //case BTN_FOOD:
        //    prevEditForm = index;
        //    setGridWordsBody(FOOD);
        //    $("#frmList").show();
        //    break;
        //case BTN_ADJECTIVE:
        //    setGridWordsBody(ADJECTIVE);
        //    $("#frmList").show();
        //    break;
        //case BTN_OFFICE:
        //    prevEditForm = index;
        //    setGridWordsBody(OFFICE);
        //    $("#frmList").show();
        //    break;
        //case BTN_COLLOCATION:
        //    prevEditForm = index;
        //    setGridWordsBody(COLLOCATION);
        //    $("#frmList").show();
        //    break;
        //case BTN_TRANSPORT:
        //    prevEditForm = index;
        //    setGridWordsBody(TRANSPORT);
        //    $("#frmList").show();
        //    break;
        //case BTN_MONEY:
        //    prevEditForm = index;
        //    setGridWordsBody(MONEY);
        //    $("#frmList").show();
        //    break;
        //case BTN_NATURAL:
        //    prevEditForm = index;
        //    setGridWordsBody(NATURAL);
        //    $("#frmList").show();
        //    break;
        //case BTN_ANIMALS:
        //    prevEditForm = index;
        //    setGridWordsBody(ANIMALS);
        //    $("#frmList").show();
        //    break;
        //case BTN_REST:
        //    prevEditForm = index;
        //    setGridWordsBody(REST);
        //    $("#frmList").show();
        //    break;
        //case BTN_MEDICAL:
        //    prevEditForm = index;
        //    setGridWordsBody(MEDICAL);
        //    $("#frmList").show();
        //    break;
        //case BTN_IDIOM:
        //    prevEditForm = index;
        //    setGridWordsBody(IDIOM);
        //    $("#frmList").show();
        //    break;
        //case BTN_CRIME_PUNISHMENT:
        //    prevEditForm = index;
        //    setGridWordsBody(CRIME_PUNISHMENT);
        //    $("#frmList").show();
        //    break;
        //case BTN_PERSON_FAMILY:
        //    prevEditForm = index;
        //    setGridWordsBody(PERSON_FAMILY);
        //    $("#frmList").show();
        //    break;
        //case BTN_TONGUE_TWISTER:
        //    prevEditForm = index;
        //    setGridWordsBody(TONGUE_TWISTER);
        //    $("#frmList").show();
        //    break;
        case BTN_CHK_WORDS:
            setGridWordsBody(CHK);
            $("#frmList").show();
            break;
        case BTN_BACKUP:
            $("#frmBackup").show();
            break;
        case BTN_BACKUP_EXPORT:
            exportDatabase();
            break;
        case BTN_BACKUP_IMPORT:
            importDatabase();
            break;
        case BTN_ADD_WORD:
            setDataToSelect('selectedGroups', 0);
            $("#frmAddWord").show();
            break;
        case BTN_ADD_WORD_SAVE:
            saveNewWord();
            break;
        case BTN_ADD_WORD_CANCEL:
            cancelNewWord()
            break;
        case BTN_EDT_WORD:
            $("#frmEditWord").show();
            break;
        case BTN_EDT_WORD_SAVE:
            saveEditWord();
            break;
        case BTN_EDT_WORD_CANCEL:
            cancelEditWord();
            break;
        case BTN_CATEG:
            setGridCategoriesBody();
            $("#frmCategories").show();
            break;
        case BTN_ADD_CATEG:
            $("#frmAddCategories").show();
            break;
        case BTN_ADD_CATEG_SAVE:
            saveNewCategorie();
            break;
        case BTN_EDT_CATEG:
            $("#frmEditCategories").show();
            break;
        case BTN_EDT_CATEG_SAVE:
            saveEditCategorie();
            break;
        case BTN_ADD_CATEG_CANCEL:
        case BTN_EDT_CATEG_CANCEL:
            cancelCategorie();
            break;
        case BTN_CATEG_VIEW:
            setCategoriesButtons();
            $("#frmCategoriesButtons").show();
            break;

        default:
    }
}

function onClickBack() {
    switch (currentForm) {
        case BTN_CATEG_VIEW:
        case BTN_CATEG:
        case BTN_EDT_WORD:
        case BTN_ADD_WORD:
        //case BTN_WORDS_PHRASES:
        //case BTN_NEW_WORDS:
        case BTN_ALL_WORDS:
        case BTN_CHK_WORDS:
        case BTN_BACKUP:
        case BTN_BACKUP_EXPORT:
        case BTN_BACKUP_IMPORT:
            currentForm = 0;
            showCurrentForm(currentForm);
            break;
        //case BTN_PHRASES:
        //case BTN_ANY:
        //case BTN_VERB:
        //    currentForm = BTN_WORDS_PHRASES;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_VERBS:
        //    currentForm = BTN_VERB;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_VERBS_IRREG:
        //    currentForm = BTN_VERB;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_HOUSE:
        //case BTN_CLOTHING:
        //case BTN_FOOD:
        //case BTN_ADJECTIVE:
        //case BTN_OFFICE:
        //case BTN_COLLOCATION:
        //case BTN_TRANSPORT:
        //case BTN_MONEY:
        //case BTN_NATURAL:
        //case BTN_ANIMALS:
        //case BTN_REST:
        //case BTN_MEDICAL:
        //case BTN_IDIOM:
        //case BTN_CRIME_PUNISHMENT:
        //case BTN_PERSON_FAMILY:
        //    currentForm = BTN_WORDS_PHRASES;
        //    showCurrentForm(currentForm);
        //    break;
        case BTN_EDT_WORD:
            currentForm = BTN_EDT_WORD;
            showCurrentForm(prevEditForm);
            break;
        case BTN_ADD_CATEG:
        case BTN_EDT_CATEG:
            currentForm = BTN_CATEG;
            showCurrentForm(prevEditForm);
            break;
        case BTN_CATEG_VIEW_DETAIL:
            currentForm = BTN_CATEG_VIEW;
            showCurrentForm(BTN_CATEG_VIEW);
            break;
        default:
            navigator.app.exitApp();
    }
}