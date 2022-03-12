var ODRL;
(function (ODRL) {
    var OdrlInJson;

    // 处理Action
    var handleAction = (actionList) => {
        if ((actionList.length === 1) && (typeof actionList[0] === 'string')) {
            return actionList[0]
        }

        const newActionList = [];
        actionList.map(action => {
            if (action.refinement) {
                const obj = {
                    "rdf:value": { "@id": `odrl: ${action.actions}` },
                    "refinement": action.refinement,
                }
                newActionList.push(obj)
            } else {
                newActionList.push(action)
            }
        })
        return newActionList
    }

    // The classes:
    // ****************************************************
    /**
    * Class for the Asset of the ODRL Core Model
    * @class Asset
    * @constructor
    * @param {String} uid The Unique Identifier of the Asset
    * @param {String} relation The relation of the asset to the policy
    */
    var Asset = (function () {
        function Asset(uid, relation) {
            this.uid = uid;
            this.relation = relation;
        }
        return Asset;
    })();
    ODRL.Asset = Asset;

    // ****************************************************
    /**
    * Class for the Action of the ODRL Core Model
    * @class Action
    * @constructor
    * @param {String} name The identifing name of the Action
    */
    var Action = (function () {
        function Action() {
            this.actions = null;
            this.refinement = [];
        }

        Action.prototype.setAction = function (action) {
            this.actions = action;
            return this;
        };

        Action.prototype.addRefinement = function (leftOperand, operator, rightOperand, unit) {
            var newConstraint = new Constraint(leftOperand, operator, rightOperand, unit);
            this.refinement.push(newConstraint);
            return this;
        };

        return Action;
    })();
    ODRL.Action = Action;

    // ****************************************************
    /**
    * Class for the Constraint of the ODRL Core Model
    * @class Constraint
    * @constructor
    * @param {String} name The identifing name of the Constraint
    * @param {String} operator The identifyer of the operator
    * @param {String} rightOperand The identifyer of the right operand
    * @param {String} dataType The identifyer of the data type of the right operand
    * @param {String} unit The identifyer of the unit of the right operand
    * @param {String} status The identifyer of the status
    */
    var Constraint = (function () {
        function Constraint(leftOperand, operator, rightOperand, unit) {
            this.leftOperand = leftOperand;
            this.operator = operator;
            this.rightOperand = rightOperand;
            this.unit = unit;
        }
        return Constraint;
    })();
    ODRL.Constraint = Constraint;

    // ****************************************************
    /**
    * Class for the Party of the ODRL Core Model
    * @class Party
    * @constructor
    * @param {String} uid The Unique Identifier of the Party
    * @param {String} pfunction The identifier of the functional role this party takes
    * @param {String} scope The scope of the party
    */
    var Party = (function () {
        function Party(uid, pfunction, scope) {
            this.uid = uid;
            this.pfunction = pfunction;
            this.scope = scope;
        }
        return Party;
    })();
    ODRL.Party = Party;

    // ****************************************************
    /**
    * Class for the Duty of the ODRL Core Model
    * @class Duty
    * @constructor
    */
    var Duty = (function () {
        function Duty() {
            this.uid = null;
            this.actions = [];
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.consequences = [];
        }
        /**
        * Method for setting the unique identifier of the Duty
        * @method setUid
        * @param {String} uid The unique identifier of the Duty
        */
        Duty.prototype.setUid = function (uid) {
            this.uid = uid;
            return this;
        };

        /**
        * Method for setting the action of the Duty
        * @method addAction
        * @param {String} action The identifier of the action
        */
        Duty.prototype.addAction = function (action) {
            var newAction = action
            this.actions.push(newAction);
            return this;
        };

        /**
        * Method for adding a duty to the Duty
        * @method addConsequence
        * @param {Duty} newDuty A duty instance
        */
        Duty.prototype.addConsequence = function (newConseq) {
            this.consequences.push(newConseq);
            return this;
        };

        /**
        * Method for adding an asset to the Duty
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Duty.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding the required target asset to the Permission
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Duty.prototype.addTargetAsset = function (uid) {
            var newTargetAsset = new Asset(uid, "target");
            this.assets.push(newTargetAsset);
            return this;
        };

        /**
        * Method for adding a constraint to the Duty
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Duty.prototype.addConstraint = function (leftOperand, operator, rightOperand, unit) {
            var newConstraint = new Constraint(leftOperand, operator, rightOperand, unit);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * Method for adding a party to the Duty
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Duty.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        Duty.prototype.buildDutyOdrlInJson = function () {
            var thisD = {};
            var i;
            if (this.actions.length > 0) {
                thisD.action = handleAction(this.actions);
            }

            var _target = [];
            this.assets.map(item => {
                if (item.relation == "target") {
                    _target.push(item.uid);
                }
            })
            if (_target.length > 1) {
                thisD.target = _target
            } else {
                thisD.target = _target[0]
            }

            if (this.constraints.length > 0) {
                thisD.constraint = this.constraints
            }
            for (i = 0; i < this.parties.length; i++) {
                if (this.parties[i].pfunction == "assigner") {
                    thisD.assigner = this.parties[i].uid;
                }
                if (this.parties[i].pfunction == "assignee") {
                    thisD.assignee = this.parties[i].uid;
                    if (this.parties[i].scope != "") {
                        thisD.assignee_scope = this.parties[i].scope;
                    }
                }
            }

            if (this.consequences.length > 0) {
                thisD.consequence = [];
                for (i = 0; i < this.consequences.length; i++) {
                    thisD.consequence.push(this.consequences[i].buildDutyOdrlInJson());
                }
            }
            return thisD;
        };
        return Duty;
    })();
    ODRL.Duty = Duty;

    // ****************************************************
    /**
    * Class for the Permission of the ODRL Core Model
    * @class Permission
    * @constructor
    */
    var Permission = (function () {
        function Permission() {
            this.actions = [];
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.duties = [];
        }
        /**
        * Method for setting the action of the Permission
        * @method addAction
        * @param {String} action The identifier of the action
        */
        Permission.prototype.addAction = function (action) {
            var newAction = action
            this.actions.push(newAction);
            return this;
        };

        /**
        * Method for adding an asset to the Permission
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Permission.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding the required target asset to the Permission
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Permission.prototype.addTargetAsset = function (uid) {
            var newAsset = new Asset(uid, "target");
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding a constraint to the Permission
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Permission.prototype.addConstraint = function (leftOperand, operator, rightOperand, unit) {
            var newConstraint = new Constraint(leftOperand, operator, rightOperand, unit);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * Method for adding a party to the Permission
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Permission.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        /**
        * Method for adding a duty to the Permission
        * @method addParty
        * @param {Duty} newDuty A duty instance
        */
        Permission.prototype.addDuty = function (newDuty) {
            this.duties.push(newDuty);
            return this;
        };

        Permission.prototype.buildOdrlInJson = function () {
            var thisP = {};
            var i;

            var _target = [];
            this.assets.map(item => {
                if (item.relation == "target") {
                    _target.push(item.uid);
                }
            })
            if (_target.length > 1) {
                thisP.target = _target
            } else {
                thisP.target = _target[0]
            }

            if (this.actions != undefined) {
                thisP.action = handleAction(this.actions);
            }
            if (this.constraints.length > 0) {
                thisP.constraint = this.constraints;
            }

            for (i = 0; i < this.parties.length; i++) {
                switch (this.parties[i].pfunction) {
                    case "assigner":
                        thisP.assigner = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisP.assigner_scope = this.parties[i].scope;
                        }
                        break;
                    case "assignee":
                        thisP.assignee = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisP.assignee_scope = this.parties[i].scope;
                        }
                        break;
                    default:
                        var fieldname = "unknownfunct" + i.toString() + "party";
                        thisP[fieldname] = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            fieldname = "unknownfunct" + i.toString() + "party_scope";
                            thisP[fieldname] = this.parties[i].scope;
                        }
                        break;
                }
            }
            if (this.duties.length > 0) {
                thisP.duty = [];
                for (i = 0; i < this.duties.length; i++) {
                    thisP.duty.push(this.duties[i].buildDutyOdrlInJson());
                }
            }
            OdrlInJson.permission.push(thisP);
        };
        return Permission;
    })();
    ODRL.Permission = Permission;

    // ****************************************************
    /**
    * Class for the Prohibition of the ODRL Core Model
    * @class Prohibition
    * @constructor
    */
    var Prohibition = (function () {
        function Prohibition() {
            this.actions = [];
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.remedy = [];
        }
        /**
        * Method for setting the action of the Prohibition
        * @method addAction
        * @param {String} action The identifier of the action
        */
        Prohibition.prototype.addAction = function (action) {
            var newAction = action
            this.actions.push(newAction);
            return this;
        };

        /**
        * Method for adding an asset to the Prohibition
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Prohibition.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding the required target asset to the Prohibition
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Prohibition.prototype.addTargetAsset = function (uid) {
            var newAsset = new Asset(uid, "target");
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding a constraint to the Prohibition
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Prohibition.prototype.addConstraint = function (leftOperand, operator, rightOperand, unit) {
            var newConstraint = new Constraint(leftOperand, operator, rightOperand, unit);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * Method for adding a constraint to the Prohibition
        * @method addRemedy
        * @param {String} action The identifing name of the Constraint
        * @param {String} target The identifyer of the operator
        */
        Prohibition.prototype.addRemedy = function (action, target) {
            var newRemedy = { action, target }
            this.remedy.push(newRemedy);
            return this;
        };

        /**
        * Method for adding a party to the Prohibition
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Prohibition.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        Prohibition.prototype.buildOdrlInJson = function () {
            var thisP = {};
            var i;

            var _target = [];
            this.assets.map(item => {
                if (item.relation == "target") {
                    _target.push(item.uid);
                }
            })
            if (_target.length > 1) {
                thisP.target = _target
            } else {
                thisP.target = _target[0]
            }

            if (this.actions != undefined) {
                thisP.action = handleAction(this.actions);
            }
            if (this.remedy.length > 0) {
                thisP.remedy = this.remedy;
            }
            if (this.constraints.length > 0) {
                thisP.constraint = this.constraints;
            }
            for (i = 0; i < this.parties.length; i++) {
                switch (this.parties[i].pfunction) {
                    case "assigner":
                        thisP.assigner = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisP.assigner_scope = this.parties[i].scope;
                        }
                        break;
                    case "assignee":
                        thisP.assignee = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisP.assignee_scope = this.parties[i].scope;
                        }
                        break;
                    default:
                        var fieldname = "unknownfunct" + i.toString() + "party";
                        var temp = {};
                        thisP[fieldname] = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            fieldname = "unknownfunct" + i.toString() + "party_scope";
                            thisP[fieldname] = this.parties[i].scope;
                        }
                        break;
                }
            }
            OdrlInJson.prohibition.push(thisP);
        };
        return Prohibition;
    })();
    ODRL.Prohibition = Prohibition;

    // ****************************************************
    /**
    * Class for the Obligation of the ODRL Core Model
    * @class Obligation
    * @constructor
    */
    var Obligation = (function () {
        function Obligation() {
            this.actions = [];
            this.assets = [];
            this.constraints = [];
            this.parties = [];
            this.duties = [];
            this.consequences = [];
        }
        /**
        * Method for setting the action of the Obligation
        * @method addAction
        * @param {String} action The identifier of the action
        */
        Obligation.prototype.addAction = function (action) {
            var newAction = action
            this.actions.push(newAction);
            return this;
        };

        /**
        * Method for adding an asset to the Obligation
        * @method addAsset
        * @param {String} uid The unique identifier of the asset
        * @param {String} relation The relation of the asset to the Duty.
        */
        Obligation.prototype.addAsset = function (uid, relation) {
            var newAsset = new Asset(uid, relation);
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding the required target asset to the Obligation
        * @method addTargetAsset
        * @param {String} uid The unique identifier of the asset
        */
        Obligation.prototype.addTargetAsset = function (uid) {
            var newAsset = new Asset(uid, "target");
            this.assets.push(newAsset);
            return this;
        };

        /**
        * Method for adding a constraint to the Obligation
        * @method addConstraint
        * @param {String} name The identifing name of the Constraint
        * @param {String} operator The identifyer of the operator
        * @param {String} rightOperand The identifyer of the right operand
        * @param {String} dataType The identifyer of the data type of the right operand
        * @param {String} unit The identifyer of the unit of the right operand
        * @param {String} status The identifyer of the status
        */
        Obligation.prototype.addConstraint = function (leftOperand, operator, rightOperand, unit) {
            var newConstraint = new Constraint(leftOperand, operator, rightOperand, unit);
            this.constraints.push(newConstraint);
            return this;
        };

        /**
        * Method for adding a party to the Obligation
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Obligation.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        /**
        * Method for adding a duty to the Obligation
        * @method addParty
        * @param {Duty} newDuty A duty instance
        */
        Obligation.prototype.addDuty = function (newDuty) {
            this.duties.push(newDuty);
            return this;
        };

        /**
        * Method for adding a duty to the Obligation
        * @method addConsequence
        * @param {Duty} newDuty A duty instance
        */
        Obligation.prototype.addConsequence = function (newConseq) {
            this.consequences.push(newConseq);
            return this;
        };

        Obligation.prototype.buildOdrlInJson = function () {
            var thisO = {};
            var i;

            var _target = [];
            this.assets.map(item => {
                if (item.relation == "target") {
                    _target.push(item.uid);
                }
            })
            if (_target.length > 1) {
                thisO.target = _target
            } else {
                thisO.target = _target[0]
            }

            if (this.actions.length > 0) {
                thisO.action = handleAction(this.actions);
            }
            if (this.constraints.length > 0) {
                thisO.constraint = this.constraints
            }

            for (i = 0; i < this.parties.length; i++) {
                switch (this.parties[i].pfunction) {
                    case "assigner":
                        thisO.assigner = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisO.assigner_scope = this.parties[i].scope;
                        }
                        break;
                    case "assignee":
                        thisO.assignee = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            thisO.assignee_scope = this.parties[i].scope;
                        }
                        break;
                    default:
                        var fieldname = "unknownfunct" + i.toString() + "party";
                        thisO[fieldname] = this.parties[i].uid;
                        if (this.parties[i].scope != "") {
                            fieldname = "unknownfunct" + i.toString() + "party_scope";
                            thisO[fieldname] = this.parties[i].scope;
                        }
                        break;
                }
            }
            if (this.duties.length > 0) {
                thisO.duties = [];
                for (i = 0; i < this.duties.length; i++) {
                    thisO.duties.push(this.duties[i].buildDutyOdrlInJson());
                }
            }
            if (this.consequences.length > 0) {
                thisO.consequence = [];
                for (i = 0; i < this.consequences.length; i++) {
                    thisO.consequence.push(this.consequences[i].buildDutyOdrlInJson());
                }
            }
            OdrlInJson.obligation.push(thisO);
        };
        return Obligation;
    })();
    ODRL.Obligation = Obligation;

    // ****************************************************
    /**
    * Class for the Policy of the ODRL Core Model
    * @class Policy
    * @constructor
    * @param {String} uid The Unique Identifier of the Asset
    * @param {String} pType The identifier of the policy type
    */
    var Policy = (function () {
        function Policy(PContext, pType) {
            this.context = PContext;
            this.type = pType;
            this.profile = null;
            this.assets = [];
            this.parties = [];
            this.permissions = [];
            this.prohibitions = [];
            this.obligations = [];
        }

        /**
        * Method for setting the profile property of the Policy
        * @method setProfile
        * @param {String} profile The identifier of the profile
        */
        Policy.prototype.setProfile = function (profile) {
            this.profile = profile;
            return this;
        };

        /**
        * Method for setting the conflict property of the Policy
        * @method setConflict
        * @param {String} conflict The identifier of the conflict
        */
        Policy.prototype.setConflict = function (conflict) {
            this.conflict = conflict;
            return this;
        };

        /**
        * Method for adding a party to the Policy
        * @method addParty
        * @param {String} uid The Unique Identifier of the Party
        * @param {String} pfunction The identifier of the functional role this party takes
        * @param {String} scope The scope of the party
        */
        Policy.prototype.addParty = function (uid, pfunction, scope) {
            var newParty = new Party(uid, pfunction, scope);
            this.parties.push(newParty);
            return this;
        };

        /**
       * Method for adding the required target asset to the Permission
       * @method addTargetAsset
       * @param {String} uid The unique identifier of the asset
       */
        Policy.prototype.addTargetAsset = function (uid) {
            var newTargetAsset = new Asset(uid, "target");
            this.assets.push(newTargetAsset);
            return this;
        };


        /**
        * Method for adding a permission to the Policy
        * @method addPermission
        * @param {Permission} newPerm A permission instance
        */
        Policy.prototype.addPermission = function (newPerm) {
            this.permissions.push(newPerm);
            return this;
        };

        /**
        * Method for adding a Prohibition to the Policy
        * @method addProhibition
        * @param {Prohibition} newProhib A prohibition instance
        */
        Policy.prototype.addProhibition = function (newProhib) {
            this.prohibitions.push(newProhib);
            return this;
        };

        /**
        * Method for adding a Obligation to the Policy
        * @method addObligation
        * @param {Obligation} newProhib A obligation instance
        */
        Policy.prototype.addObligation = function (newObli) {
            this.obligations.push(newObli);
            return this;
        };

        Policy.prototype.buildOdrlInJson = function () {
            OdrlInJson = {};
            OdrlInJson["@context"] = this.context;
            OdrlInJson["@type"] = this.type;

            if (this.conflict != undefined && this.conflict != "") {
                OdrlInJson.conflict = this.conflict;
            }
            if (this.target) {
                OdrlInJson.target = this.target;
            }
            if (this.undefined != undefined && this.undefined != "") {
                OdrlInJson.undefined = this.undefined;
            }
            if (this.inheritAllowed != undefined && this.inheritAllowed != "") {
                OdrlInJson.inheritallowed = this.inheritAllowed;
            }
            if (this.inheritFrom != undefined && this.inheritFrom != "") {
                OdrlInJson.inheritfrom = this.inheritFrom;
            }
            if (this.inheritRelation != undefined && this.inheritRelation != "") {
                OdrlInJson.inheritrelation = this.inheritRelation;
            }
            if (this.profile) {
                OdrlInJson.profile = this.profile;
            }


            var _target = [];
            this.assets.map(item => {
                if (item.relation == "target") {
                    _target.push(item.uid);
                }
            })
            if (_target.length > 1) {
                OdrlInJson.target = _target
            } else {
                OdrlInJson.target = _target[0]
            }

            if (this.permissions.length > 0) {
                OdrlInJson.permission = [];
                for (var i = 0; i < this.permissions.length; i++) {
                    this.permissions[i].buildOdrlInJson();
                }
            }
            if (this.prohibitions.length > 0) {
                OdrlInJson.prohibition = [];
                for (var i = 0; i < this.prohibitions.length; i++) {
                    this.prohibitions[i].buildOdrlInJson();
                }
            }
            if (this.obligations.length > 0) {
                OdrlInJson.obligation = [];
                for (var i = 0; i < this.obligations.length; i++) {
                    this.obligations[i].buildOdrlInJson();
                }
            }

            this.parties.map(item => {
                switch (item.pfunction) {
                    case "assigner":
                        OdrlInJson.assigner = item.uid;
                        break;
                    case "assignee":
                        OdrlInJson.assignee = item.uid;
                        break;
                    default:
                        break;
                }
            })
        };

        /**
        * Method for serializing the Policy to the official ODRL JSON syntax
        * @method serializeJson
        */
        Policy.prototype.serializeJson = function () {
            this.buildOdrlInJson();
            return JSON.stringify(OdrlInJson, null, 2);
        };

        /**
        * Method for serializing the Policy to JSON reflecting the Core Model
        * @method serializeCoreModelJson
        */
        Policy.prototype.serializeCoreModelJson = function () {
            return JSON.stringify(this, null, 2);
        };
        return Policy;
    })();
    ODRL.Policy = Policy;
})(ODRL || (ODRL = {}));

export default ODRL