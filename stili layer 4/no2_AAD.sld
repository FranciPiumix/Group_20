<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>CzechRepublic_no2 _2017-2021_AAD</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="intervals">
              <sld:ColorMapEntry color="#003366" label="&lt;= -5,0000" quantity="-5"/>
              <sld:ColorMapEntry color="#6f8ead" label="-5,0000 - -2,0000" quantity="-2"/>
              <sld:ColorMapEntry color="#abd0e3" label="-2,0000 - 0,0000" quantity="0"/>
              <sld:ColorMapEntry color="#dcb8b4" label="0,0000 - 2,0000" quantity="2"/>
              <sld:ColorMapEntry color="#ca6f7d" label="2,0000 - 5,0000" quantity="5"/>
              <sld:ColorMapEntry color="#ca0020" label="> 5,0000" quantity="inf"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
