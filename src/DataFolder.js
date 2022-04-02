import React, { Component } from "react";
import axios from "axios";

class DataFolder extends Component {

    constructor() {
        super();
        this.state = {
            card: [],
            loading: false,
            page: 0,
            prevY: 0

        };

    }

    componentDidMount() {
        this.getCards(1);
        var options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };
        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );
        this.observer.observe(this.loadingRef);
    }

    handleObserver(entities, observer) {
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y) {
            this.getCards((this.state.card.length / 10) + 1);
        }
        this.setState({ prevY: y });
    }

    getCards = (pageNo) => {
        this.setState({ loading: true });
        axios.get(
            `https://api.pokemontcg.io/v2/cards?page=${pageNo}&pageSize=10`
        ).then(response => {
            if (response.status == 200) {
                const refindedData = response.data.data.map(d => {
                    return { id: d.id, image: d.images.small, hp: d.hp, name: d.name, attacks: d.attacks.map(a => a.name), abilities: d.abilities ? d.abilities.map(a => a.name) : 'NA' }
                })
                const data = [...this.state.card, ...refindedData]
                this.setState({ card: data });
            }
        }).catch(error => {
            console.log(error, 'getting data failed');
        });
    }

    loadingCSS = {
        margin: "20px"
    };

    render() {

        const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

        return (
            <div className="container" style={{ padding: "20px", backgroundColor: "white" }}>
                <div style={{ margin: "50px", backgroundColor: "cyan" }}>
                    {this.state.card.length > 0 &&
                        this.state.card.map(c => {
                            const { id, image, hp, name, attacks, abilities } = c
                            return <div className="row" style={{display: "inline-flex"}}>
                                <div style={{ margin: "30px" }}>
                                    <div className="card" style={{width: "200px", marginLeft:"20px", marginRight:"20px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", boxShadow: "1px 1px 1px 1px"}}>
                                        <img height={200} src={image}></img>
                                        <div style={{ fontSize: "10px", lineHeight: "2px", margin: "10px" }}>
                                            <div className="row">
                                                <p className="card-title col-md-7"><strong>{name}</strong></p>
                                                <p className="card-text col-md-5">HP:{hp}</p>
                                            </div>
                                            <p className="card-text"><strong>Attacks:</strong></p>
                                            <p className="card-text">{attacks}</p>
                                            <p className="card-text"><strong>Abilities:</strong></p>
                                            <p className="card-text">{abilities}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        })}
                </div>

                <div ref={loadingRef => (this.loadingRef = loadingRef)} style={this.loadingCSS}>
                </div>
            </div>
        );
    }
}


export default DataFolder;