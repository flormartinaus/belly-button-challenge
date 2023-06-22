// Dashboard Belly Button Biodiversity - Plotly.js
// samples.json file contains data for names, metadata, and samples

// Function to build metadata panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var result = metadata.find((sampleObject) => sampleObject.id == sample);
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Function to build charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var result = samples.find((sampleObject) => sampleObject.id == sample);

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // Build a BUBBLE Chart
    var bubbleLayout = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a BAR Chart
    var barData = [
      {
        y: ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
        x: values.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
