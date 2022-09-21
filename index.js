const express = require('express');// laadib sisse Express.js raamistiku, mis on populaarne Node.js põhine raamistik API-de tegemiseks.
const cors = require('cors');//laadib sisse cors paketi, mis võimaldab saata nn CORS päised päringu vastustega kaasa, mis lubavad API-t kasutada brauserist, juhul kui API server ja brauseris töötav kliendirakendus ei ole serveeritud ühest ja samast asukohast.
const app = express();//initsialiseerib Express raamistiku (tekib app objekt)

app.use(cors());        // ütleb Expressile, et iga sissetuleva HTTP päringu puhul töödeldaks seda cors() funktsiooniga, mis lisab vastusesse CORS päised.
app.use(express.json()) // ütleb Expressile, et iga sissetuleva HTTP päringu puhul töödeldaks seda express.json(( funktsiooniga, mis analüüsib päringu keha ja kui seal on JSON, siis loeb JSONist parameetrid req.body objekti)
// defineerivad widgets nimelise massiivi, millel on 3 liiget, mis on objektid, millel on 3 atribuuti: id, name ja price
const widgets = [
    { id: 1, name: "Cizzbor", price: 29.99 },
    { id: 2, name: "Woowo", price: 26.99 },
    { id: 3, name: "Crazlinger", price: 59.99 },
]
//defineerivad lõpp-punkti GET /widgets päringule, mis saadab vastusena terve widgets massiivi (mis on defineeritud ridadel 8-12)
app.get('/widgets', (req, res) => {
    res.send(widgets)
})
//defineerivad lõpp-punkti GET /widgets/id päringule, mis saadab vastusena selle id-ga vastaneva vidina widgets massiivist (defineeritud ridadel 8-12), mis on lisatud /widgets/id asemele. Kui päringul on selline id, mida widgets massiivis ei ole defineeritud, saadetakse tagasi veateade “Widget not found”
app.get('/widgets/:id', (req, res) => {
    if (typeof widgets[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "Widget not found" })
    }
    res.send(widgets[req.params.id - 1])
})
//defineerivad lõpp-punkti POST /widgets päringule, mis lisab kollektsiooni uue widgeti
app.post('/widgets', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' })//kontrollivad, et päringul oleks kõik kohustuslikud parameetrid uue vidina lisamiseks
    }
    let newWidget = {
        id: widgets.length + 1, //defineerivad, millised on kohustuslikud parameetrid uue vidina lisamiseks. Uue vidina id saamiseks liidetakse massiivis olevate vidinate arvule juurde 1
        price: req.body.price,
        name: req.body.name
    }
    widgets.push(newWidget)// defineerib uue vidina lisamist widgets massiivi
    res.status(201).location('localhost:8080/widgets/' + (widgets.length - 1)).send(// defineerib vastuse eduka päringu puhul staatuse 201
        newWidget
    )
})

app.listen(8080, () => {// kutsutakse välja meetod listen(). Esimeseks argumendiks on port 8080, millel hakatakse kuulama päringuid. Teiseks (valikuline) argumendiks funktsiooni, kus prinditakse konsoolile aadressi, millel on rakendus kättesaadav
    console.log(`API up at: http://localhost:8080`)
})