var chai = require('chai');
var grades = require('../index.js');

var expect = chai.expect

describe("Grades", function () {
  describe("freeClimbing", function () {
    describe("clean", function () {
      describe("yds", function(){
        it("should have valid grades", function () {
          var expected = [
            "5.0","5.1","5.2","5.3","5.4",
            "5.5","5.6","5.7","5.8","5.9",
            "5.10a","5.10b","5.10c","5.10d",
            "5.11a","5.11b","5.11c","5.11d",
            "5.12a","5.12b","5.12c","5.12d",
            "5.13a","5.13b","5.13c","5.13d",
            "5.14a","5.14b","5.14c","5.14d",
            "5.15a","5.15b","5.15c","5.15d"
          ]
          var actual = grades.freeClimbing.clean.yds
          expect(actual).to.have.ordered.members(expected);
          expect(actual).to.be.an('array');
          expect(actual.length).to.equal(expected.length);
        });
      });
      describe("class", function () {
        it("should have valid grades", function () {
          var expected = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
          var actual = grades.freeClimbing.clean.class;
          expect(actual).to.have.ordered.members(expected);
          expect(actual).to.be.an('array');
          expect(actual.length).to.equal(expected.length);
        });
      });
      describe("britishTech", function (){
        it("should have valid grades", function () {
          var expected = ['1','2','3','4a','4b','4c',
            '5a','5b','5c','6a','6b','6c','7a','7b'];
            var actual = grades.freeClimbing.clean.britishTech;
            expect(actual).to.have.ordered.members(expected);
            expect(actual).to.be.an('array');
            expect(actual.length).to.equal(expected.length);
        });
      });
      describe("britishAdj", function () {
        it("should have valid grades", function () {
          var expected = ['M','D','VD','S','HS','HVS',
          'E1','E2','E3','E4','E5','E6','E7','E8','E9','E10',
          'E11'];
          var actual = grades.freeClimbing.clean.britishAdj;
          expect(actual).to.have.ordered.members(expected);
          expect(actual).to.be.an('array');
          expect(actual.length).to.equal(expected.length);
        });
      });
      describe("French", function(){

      });
      describe("UIAA", function () {
        it("should have valid grades", function () {
          var expected = ['I','II','III','IV','IV+/V-',
            'V','V+','VI-','VI','VI+','VII-','VII','VII+',
            'VIII-','VIII','VIII+','IX-','IX','IX+','X-',
            'X','X+','XI-','XI','XI+','XII-','XII'];
          var actual = grades.freeClimbing.clean.UIAA;
          expect(actual).to.have.ordered.members(expected);
          expect(actual).to.be.an('array');
          expect(actual.length).to.be.equal(expected.length);
        });
      });
    });
  });
  describe("protection", function () {
    it("should have valid protection ratings", function () {
      var expected = ["G","PG","PG13","R","X"];
      var actual = grades.protection;
      expect(actual).to.have.ordered.members(expected);
      expect(actual).to.be.an('array');
      expect(actual.length).to.equal(expected.length);
    });
  });
});