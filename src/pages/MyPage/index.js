import ODRL from './ODRLclasses';


const MyPage = () => {
    // const policy1 = new ODRL.Policy('http://www.w3.org/ns/odrl.jsonld', 'Aggrement');
    // const assigner = 'assingerURL';
    // const assignee = 'assigneeURL';
    // policy1.setAssigner(assigner).setAssignee(assignee).setTarget('TargetURL');

    // // 创建Permission
    // const perm1 = new ODRL.Permission();
    // const permAction1 = 'use';
    // const permTarget1 = 'targetURL1';
    // const permConstraintOperator = 'lteq';
    // const perConstraintRightOperator = {
    //     "@value": "1000",
    //     "@type": "xsd:integer"
    // }
    // perm1.addAction(permAction1)
    //     .addTargetAsset(permTarget1)
    //     .addConstraint("count", permConstraintOperator, perConstraintRightOperator, "", "", "")
    // policy1.addPermission(perm1)

    // // 创建Prohibition
    // const proh1 = new ODRL.Prohibition();
    // const prohAction1 = 'save';
    // proh1.addAction(prohAction1)
    //     .addTargetAsset(permTarget1);
    // policy1.addProhibition(proh1);

    // // 创建Obligation
    // const obli1 = new ODRL.Obligation();
    // const obliAction1 = 'delete';
    // const obliConstraintOperator = 'eq';
    // const constraintTarget = {
    //     "@value": "10.00",
    //     "@type": "xsd:decimal"
    // };


    // const consequence1 = new ODRL.Duty();
    // consequence1.addAction('killJob')
    //     .addTargetAsset('killJobUrl')

    // obli1.addAction(obliAction1)
    //     .addTargetAsset('targetURL1')
    //     .addConstraint('spatial', obliConstraintOperator, constraintTarget, "", "http://dbpedia.org/resource/Euro", "")
    //     .addConsequence(consequence1)

    // // policy1.addPermission(perm1);
    // // policy1.addProhibition(perm1);
    // console.log('policy10-00', policy1)
    // policy1.addObligation(obli1);
    // const outStr = policy1.serializeJson();


    const policy = new ODRL.Policy("http://www.w3.org/ns/odrl.jsonld", "Aggrement");
    policy.setProfile("http://example.com/odrl:profile")
        .addTargetAsset("http://example.com/asset:9898.movie")
        .addParty("http://example.com/org/assigner", "assigner")
        .addParty("http://example.com/org/assignee", "assignee")



    // const perm = new ODRL.Permission();

    // // 创建Permission的Action
    // const permAction = new ODRL.Action();
    // permAction.setAction('use')
    //     .addRefinement("count", "lteq", { "@value": "1000", "@type": "xsd:integer" });

    // // 先创建Duty的Action
    // const permDutyAction = new ODRL.Action();
    // permDutyAction.setAction('delete')
    //     .addRefinement("delayPeriod", "gteq", { "@value": "P60", "@type": "xsd:duration" })

    // // 建Permission的Duty
    // const permDuty = new ODRL.Duty();
    // permDuty.addAction(permDutyAction)


    // const consequence = new ODRL.Duty();
    // consequence.addAction('killJob')
    //     .addTargetAsset('killJobUrl')
    // permDuty.addConsequence(consequence)

    // // 为Permission添加Action、Target、Assigner、Assignee、Constraint和Duty
    // perm
    //     .addAction(permAction)
    //     .addDuty(permDuty);
    // policy.addPermission(perm);


    // const action = new ODRL.Action();
    // action.setAction('use').addRefinement("dateTime", "lteq", { "@value": "2017-12-31", "@type": "xsd:date" })

    // const duty1 = new ODRL.Duty();
    // duty1.addConstraint("event", "lt", { "@id": "odrl:policyUsage" })
    // const duty2 = new ODRL.Duty();
    // const dutyAction = new ODRL.Action();
    // dutyAction.setAction('compensate').addRefinement("payAmount", "eq", { "@value": "5.00", "@type": "xsd:decimal" }, "http://dbpedia.org/resource/Euro")
    // duty2.addAction(dutyAction)

    // const perm = new ODRL.Permission();
    // perm
    //     .addAction(action)
    //     .addTargetAsset("http://example.com/asset:9898.movie")
    //     .addParty("http://example.com/org/assigner", "assigner")
    //     .addParty("http://example.com/org/assignee", "assignee")
    //     .addConstraint("dateTime", "lteq", { "@value": "2017-12-31", "@type": "xsd:date" })
    //     .addDuty(duty1)
    //     .addDuty(duty2)

    // policy.addPermission(perm);




    // const proh = new ODRL.Prohibition();
    // proh
    //     .addAction('distribute')
    //     .addTargetAsset("http://example.com/asset:9898.movie")
    //     .addRemedy("delete", "http://example.com/asset:9898.movie");
    // policy.addProhibition(proh);




    const obliAction = new ODRL.Action();
    obliAction.setAction('delete')
        .addRefinement("delayPeriod", "gteq", { "@value": "P60M", "@type": "xsd:duration" });

    // 先为Consequence创建一个有约束条件的Action
    const consAction = new ODRL.Action();
    consAction.setAction('compensate')
        .addRefinement("payAmount", "lteq", "10.0", "http://dbpedia.org/resource/Euro");

    // 创建Consequence并添加Action
    const consequence1 = new ODRL.Duty();
    consequence1.addAction(consAction)

    // 可创建多个Consequence，指定Action、Target等
    const consequence2 = new ODRL.Duty();
    consequence2.addAction('killJob')
        .addTargetAsset('killJobURL')

    // 创建Obligation并添加Action、Target、Constraint、Consequence等
    const obli = new ODRL.Obligation();
    obli
        .addAction(obliAction)
        .addTargetAsset('targetURL1')
        .addConsequence(consequence1)
        .addConsequence(consequence2)
    policy.addObligation(obli)

    const outStr = policy.serializeJson();

    console.log(outStr)








    fetch("http://8.129.176.152:1337/kong/services", {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.nV_CVCt9qa8EYuvy0zWw7O1pXH97L-MnaZfB-9u8mqw",

        }
    })
        .then(response => response.json())
        .then(data => console.log('data--', data))
        .catch(err => {
            console.error(err);
        });


    return <div>
        we
    </div>
}
export default MyPage