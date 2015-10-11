(function(){
	 describe('Checkform', function(){
		describe('#isNum_()', function(){
			it('Nomal number', function(){
				window.__test__.isNum_("10").should.equal(true);
				window.__test__.isNum_("9999999999999999999").should.equal(true);
				window.__test__.isNum_("0").should.equal(true);
				window.__test__.isNum_("0.25").should.equal(true);
				window.__test__.isNum_("13.25").should.equal(true);
				window.__test__.isNum_("25.").should.equal(true);
				window.__test__.isNum_(".25").should.equal(true);
				window.__test__.isNum_("025").should.equal(true);
				window.__test__.isNum_("99999999999998888.12345698760").should.equal(true); 
			});
			it('Number with signs', function(){
				window.__test__.isNum_("+0").should.equal(true);
				window.__test__.isNum_("-0").should.equal(true);
				window.__test__.isNum_("+13.25").should.equal(true);
				window.__test__.isNum_("-13.25").should.equal(true);
				window.__test__.isNum_("+255").should.equal(true);
				window.__test__.isNum_("-255").should.equal(true);
				window.__test__.isNum_(".255").should.equal(true);
			});
			it('Not Number', function(){
				window.__test__.isNum_("+").should.equal(false);
				window.__test__.isNum_("-").should.equal(false);
				window.__test__.isNum_("123+425").should.equal(false);
				window.__test__.isNum_("aabo").should.equal(false);
				window.__test__.isNum_("123a").should.equal(false);
				window.__test__.isNum_("+.12").should.equal(false);
			});
		});
		describe('#isPositiveInt_()', function(){
			it('nomal positive integer', function(){
				window.__test__.isPositiveInt_("10").should.equal(true);
				window.__test__.isPositiveInt_("9999999999999999999").should.equal(true);
			});
			it('integer with "+"', function(){
				window.__test__.isPositiveInt_("+10").should.equal(true);
			});
			it('not integer', function(){
				window.__test__.isPositiveInt_("01111").should.equal(false);
				window.__test__.isPositiveInt_("++123").should.equal(false);
				window.__test__.isPositiveInt_("abc").should.equal(false);
				window.__test__.isPositiveInt_("123.5").should.equal(false);
				window.__test__.isPositiveInt_("0").should.equal(false);
				window.__test__.isPositiveInt_("+0").should.equal(false);
				window.__test__.isPositiveInt_("-0").should.equal(false);
				window.__test__.isPositiveInt_(".123").should.equal(false);
			});
		});
		describe('#formcorrect_()', function(){
			it('form correct', function(){
				window.__test__.formcorrect_("0", "100", "10").should.equal(true);
				window.__test__.formcorrect_("1", "10", "120").should.equal(true);
				window.__test__.formcorrect_("0.5", "0.5", "50").should.equal(true);
			});
			it('form out of range', function(){
				window.__test__.formcorrect_("10", "100", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "0", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "100", "150").should.equal(false);
				window.__test__.formcorrect_("0.5", "0", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "100", "150").should.equal(false);
			});
			it('form not a number', function(){
				window.__test__.formcorrect_("4a", "100", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "4a", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "100", "4a").should.equal(false);
			});
			it('form not positive', function(){
				window.__test__.formcorrect_("-0.5", "100", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "-100", "50").should.equal(false);
				window.__test__.formcorrect_("0.5", "100", -"50").should.equal(false);
			});
		});
	}); 
	
	describe('Game rules', function() {
		describe('#judge()', function() {
			window.__test__.setgridCnt(50);
			it('3 neighbor cells are alive, alive', function() {
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.setmap(26, 25, 1);
				window.__test__.judge_(25, 25).should.equal(1);
			});
			it('2 neighbor cells are alive, stay', function() {
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.judge_(25, 25).should.equal(0);
	
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.setmap(25, 25, 1);
				window.__test__.judge_(25, 25).should.equal(1);
	
			});
			it('Otherwise dead', function() {
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.judge_(25, 25).should.equal(0);
	
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 25, 1);
				window.__test__.judge_(25, 25).should.equal(0);

				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.setmap(25, 27, 1);
				window.__test__.setmap(24, 25, 1);
				window.__test__.setmap(25, 25, 1);
				window.__test__.judge_(25, 25).should.equal(0);

				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.setmap(25, 27, 1);
				window.__test__.setmap(24, 25, 1);
				window.__test__.setmap(26, 25, 1);
				window.__test__.judge_(25, 25).should.equal(0);
			});
			it('walls should always be walls', function() {
				window.__test__.init_();
				window.__test__.setmap(25, 24, 1);
				window.__test__.setmap(25, 26, 1);
				window.__test__.setmap(26, 25, 1);
				window.__test__.setmap(25, 25, 2);
				window.__test__.judge_(25, 25).should.equal(2);

			});
		});
		describe('#change()', function() {
			window.__test__.setgridCnt(50);
			it('test example', function() {
				var data = [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0]];
				window.__test__.init_();
				for (var idx in data) {
					window.__test__.setmap(data[idx][0], data[idx][1], 1);
				}
				for (var k = 0; k < 30; k++) {
					window.__test__.change_();
				}
				for (idx in data) {
					window.__test__.getmap(data[idx][0], 1 - data[idx][1]).should.equal(1);
					window.__test__.setmap(data[idx][0], 1 - data[idx][1], 0);
				}
				for (var x = 0; x < 6; x++) {
					for (var y = 0; y < 6; y++) {
						window.__test__.getmap(x, y).should.equal(0);
					}
				}
			});
		});
	});
})();