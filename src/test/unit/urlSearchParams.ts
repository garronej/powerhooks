import { addParamToUrl, retrieveParamFromUrl, retrieveAllParamStartingWithPrefixFromUrl } from "../../tools/urlSearchParams";
import { assert } from "tsafe/assert";
import { same } from "evt/tools/inDepth/same";


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

console.log("PASS");





