// Дэлгэцтэй ажиллах controller
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatMoney = function(number, type) {
    number += "";
    // 1. Урвуу харуулна
    number = number
      .split("")
      .reverse()
      .join("");
    // 2. Таслалаар тусгаарлана
    var y = "";
    var count = 1;
    for (let i = 0; i < number.length; i++) {
      y += number[i];
      if (count % 3 === 0) y += ",";
      count++;
    }
    number = y;
    // 3. Урвуу харуулна
    number = number
      .split("")
      .reverse()
      .join("");
    // 4. Хэрвээ хамгийн эхний элемент таслал байвал устгана
    if (number[0] === ",") number = number.substr(1);

    var typeStr = type === "inc" ? "+ " : "- ";

    return typeStr.concat(number);
  };

  return {
    displayDate: function() {
      var today = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        today.getMonth() + " month";
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    getDomstrings: function() {
      return DOMstrings;
    },
    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fields.forEach((x, index) => {
        x.value = "";
      });
      fields[0].focus();
    },
    addListItem: function(item, type) {
      // Орлого, зарлагын элементийг агуулсан HTML-ыг бэлтгэнэ
      var list, itemHTML;

      if (type === "inc") {
        list = DOMstrings.incomeList;
        itemHTML = `
        <div class="item clearfix" id="inc-%ID%">
            <div class="item__description">%DESCRIPTION%</div>
            <div class="right clearfix">
                <div class="item__value">%VALUE%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
      } else {
        list = DOMstrings.expenseList;
        itemHTML = `
        <div class="item clearfix" id="exp-%ID%">
            <div class="item__description">%DESCRIPTION%</div>
            <div class="right clearfix">
                <div class="item__value">%VALUE%</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
      }
      // Тэр HTML дотроо орлого, зарлагын утгуудыг REPLACE ашиглаж өөрчилнө
      itemHTML = itemHTML.replace("%ID%", item.id);
      itemHTML = itemHTML.replace("%DESCRIPTION%", item.description);
      itemHTML = itemHTML.replace("%VALUE%", formatMoney(item.value, type));
      // Бэлтгэсэн HTML-ээ DOM-руу хийж өгнө
      document.querySelector(list).insertAdjacentHTML("beforeend", itemHTML);
    },
    deleteListItem: function(id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    tusviigUzuuleh: function(tusuv) {
      var type;
      type = tusuv.tusuv > 0 ? "inc" : "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        type === "inc" ? tusuv.tusuv : tusuv.tusuv * -1,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      document.querySelector(DOMstrings.percentageLabel).textContent =
        tusuv.huvi === 0 ? tusuv.huvi : tusuv.huvi + "%";
    },
    displayPercentages: function(percentages) {
      // Зарлагын NodeList ийг олох
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      elements.forEach(function(el, index) {
        el.textContent = percentages[index];
      });
    }
  };
})();

// Санхүүтэй ажиллах controller
var financeController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.items[type].forEach(function(el) {
      sum += el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    tusuv: 0,
    huvi: 0
  };

  return {
    addItem: function(type, desc, val) {
      var item, id;
      var itemsLength = data.items[type].length;

      if (itemsLength === 0) id = 1;
      else {
        id = data.items[type][itemsLength - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },
    tusviigTootsooloh: function() {
      calculateTotal("inc");
      calculateTotal("exp");

      data.tusuv = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    tusviigAvah: function() {
      return {
        huvi: data.huvi,
        tusuv: data.tusuv,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },
    deleteItem: function(type, id) {
      var ids = data.items[type].map(function(el) {
        return el.id;
      });

      var index = ids.indexOf(id);
      if (index !== -1) data.items[type].splice(index, 1);
    },
    calculatePercentages: function() {
      data.items.exp.forEach(function(el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var percentages = data.items.exp.map(function(el) {
        return el.getPercentage();
      });

      return percentages;
    }
  };
})();

// Програмын холбогч controller
var appController = (function(uiController, financeController) {
  var cntrlAddItem = function() {
    // 1. Оруулах өгөгдлийг дэлгэцээс олж авна
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлийг Санхүүгийн контроллерт дамжуулж өгөгдлийг тэнд хадгална
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Олж авсан өгөгдлийг веб дээрээ тохирох хэсэгт нь гаргана
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      // Төсвийг шинээр тооцоолоод дэлгэцэнд хэвлэнэ
      updateTusuv();
    }
  };

  var updateTusuv = function() {
    // 1. Төсвийг тооцоолно
    financeController.tusviigTootsooloh();
    // 2. Эцсийн үлдэгдэл
    var tusuv = financeController.tusviigAvah();
    console.log(tusuv);
    // 3. Төсвийн тооцоог дэлгэцэнд гаргана
    uiController.tusviigUzuuleh(tusuv);
    // 4. Элементүүдийн хувийг тооцоолно
    financeController.calculatePercentages();
    // 5. Элементүүдийн хувийг хүлээж авна
    var percentages = financeController.getPercentages();
    // 6. Эдгээр хувийг дэлгэцэнд харуулна
    uiController.displayPercentages(percentages);
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDomstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      cntrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        cntrlAddItem();
      }
    });

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function(event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          // 1. Санхүүгийн модулиас type, id ашиглаад устгана
          financeController.deleteItem(type, itemId);
          // 2. Дэлгэц дээрээс нь элементийг устгана
          uiController.deleteListItem(id);
          // 3. Үлдэгдэл тооцоог шинэчилж харуулна
          // Төсвийг шинээр тооцоолоод дэлгэцэнд хэвлэнэ
          updateTusuv();
        }
      });
  };

  return {
    init: function() {
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        huvi: 0,
        tusuv: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
