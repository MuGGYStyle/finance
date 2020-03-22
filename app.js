// Дэлгэцтэй ажиллах controller
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list"
  };

  return {
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
        <div class="item clearfix" id="income-%ID%">
            <div class="item__description">%DESCRIPTION%</div>
            <div class="right clearfix">
                <div class="item__value">+ %VALUE%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
      } else {
        list = DOMstrings.expenseList;
        itemHTML = `
        <div class="item clearfix" id="expense-%ID%">
            <div class="item__description">%DESCRIPTION%</div>
            <div class="right clearfix">
                <div class="item__value">- %VALUE%</div>
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
      itemHTML = itemHTML.replace("%VALUE%", item.value);
      // Бэлтгэсэн HTML-ээ DOM-руу хийж өгнө
      document.querySelector(list).insertAdjacentHTML("beforeend", itemHTML);
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
  };

  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    }
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
      // 4. Төсвийг тооцоолно
      // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана
    }
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
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
