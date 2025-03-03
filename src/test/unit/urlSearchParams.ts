import { addParamToUrl, retrieveParamFromUrl, retrieveAllParamStartingWithPrefixFromUrl } from "../../tools/urlSearchParams";
import { assert } from "tsafe/assert";
import { same } from "evt/tools/inDepth/same";

console.log("START");


assert(same(
	addParamToUrl({
		"url": "https://example.com",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com?",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com#",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar#"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com#xx",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar#xx"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com?p=x#xx",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?p=x&foo=bar#xx"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com?foo=notBar",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com?foo=notBar&baz=xxx",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?baz=xxx&foo=bar"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar",
		"name": "foo"
	}),
	{
		"wasPresent": true,
		"value": "bar",
		"newUrl": "https://www.example.com"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx",
		"name": "foo"
	}),
	{
		"wasPresent": true,
		"value": "bar",
		"newUrl": "https://www.example.com?baz=xxx"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx",
		"name": "yyy"
	}),
	{ "wasPresent": false }
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx",
		"name": "yyy"
	}),
	{ "wasPresent": false }
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://www.example.com?xxx_foo=a&xxx_bar=b&baz=c",
		"prefix": "xxx_",
		"doLeavePrefixInResults": false
	}),
	{
		"newUrl": "https://www.example.com?baz=c",
		"values": {
			"foo": "a",
			"bar": "b"
		}
	}
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://www.example.com?xxx_foo=a&xxx_bar=b&baz=c",
		"prefix": "xxx_",
		"doLeavePrefixInResults": true
	}),
	{
		"newUrl": "https://www.example.com?baz=c",
		"values": {
			"xxx_foo": "a",
			"xxx_bar": "b"
		}
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://datalab.sspcloud.fr/?palette=ultraviolet&title=Eurostat",
		"name": "title"
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?palette=ultraviolet",
		"wasPresent": true,
		"value": "Eurostat"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b&oidc=c",
		"name": "oidc"
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b",
		"wasPresent": true,
		"value": "c"
	}
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b&oidc=c&other=xxx",
		"prefix": "oidc",
		"doLeavePrefixInResults": false
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?other=xxx",
		values: {
			"_1": "a",
			"_2": "b",
			"": "c"
		}
	}
));





assert(same(
	addParamToUrl({
		"url": "https://example.com?foo=notBar#xx",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?foo=bar#xx"
	}
));

assert(same(
	addParamToUrl({
		"url": "https://example.com?foo=notBar&baz=xxx#xx",
		"name": "foo",
		"value": "bar"
	}),
	{
		"newUrl": "https://example.com?baz=xxx&foo=bar#xx"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar#xx",
		"name": "foo"
	}),
	{
		"wasPresent": true,
		"value": "bar",
		"newUrl": "https://www.example.com#xx"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx#xx",
		"name": "foo"
	}),
	{
		"wasPresent": true,
		"value": "bar",
		"newUrl": "https://www.example.com?baz=xxx#xx"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx#xx",
		"name": "yyy"
	}),
	{ "wasPresent": false }
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://www.example.com?foo=bar&baz=xxx#xx",
		"name": "yyy"
	}),
	{ "wasPresent": false }
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://www.example.com?xxx_foo=a&xxx_bar=b&baz=c#xx",
		"prefix": "xxx_",
		"doLeavePrefixInResults": false
	}),
	{
		"newUrl": "https://www.example.com?baz=c#xx",
		"values": {
			"foo": "a",
			"bar": "b"
		}
	}
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://www.example.com?xxx_foo=a&xxx_bar=b&baz=c#xx",
		"prefix": "xxx_",
		"doLeavePrefixInResults": true
	}),
	{
		"newUrl": "https://www.example.com?baz=c#xx",
		"values": {
			"xxx_foo": "a",
			"xxx_bar": "b"
		}
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://datalab.sspcloud.fr/?palette=ultraviolet&title=Eurostat#xx",
		"name": "title"
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?palette=ultraviolet#xx",
		"wasPresent": true,
		"value": "Eurostat"
	}
));

assert(same(
	retrieveParamFromUrl({
		"url": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b&oidc=c#xx",
		"name": "oidc"
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b#xx",
		"wasPresent": true,
		"value": "c"
	}
));

assert(same(
	retrieveAllParamStartingWithPrefixFromUrl({
		"url": "https://datalab.sspcloud.fr/?oidc_1=a&oidc_2=b&oidc=c&other=xxx#xx",
		"prefix": "oidc",
		"doLeavePrefixInResults": false
	}),
	{
		"newUrl": "https://datalab.sspcloud.fr/?other=xxx#xx",
		values: {
			"_1": "a",
			"_2": "b",
			"": "c"
		}
	}
));

console.log("PASS");





